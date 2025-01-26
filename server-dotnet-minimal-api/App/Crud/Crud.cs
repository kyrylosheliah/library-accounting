using LibAcct.App.PagedFilter;
using System.Linq.Dynamic.Core;
using Microsoft.EntityFrameworkCore.DynamicLinq;

namespace LibAcct.App.Crud;

public class Relation {
    public string FromPropertyName { get; set; } = null!;
    public string ToEntityName { get; set; } = null!;
}

public class CrudSpecification<T> {
    public string[] AuthorizationPolicies { get; set; } = [];
    public Action<T>? ModifyAfterGetMultiple { get; set; } = null;
    public string[] EnsureUniqueBeforePost { get; set; } = null!;
    public Func<T, AppDatabase, CancellationToken, Task<bool>>? EnsureExistsBeforePost { get; set; } = null;
    public Action<T>? ModifyBeforePost { get; set; } = null;
    public Action<T>? ModifyAfterPost { get; set; } = null;
    public Action<T, T>? ModifyBeforePut { get; set; } = null;
    public bool? ForbidPut { get; set; } = null;
}

public class Crud<T> where T : class, IEntity, new() {

    public static void MapEndpoints(
        IEndpointRouteBuilder app,
        CrudSpecification<T> spec
    ) {
        var entityName = typeof(T).Name;
        var routePrefix = "/" + entityName.ToLower();

        app
            .MapDelete(routePrefix + "{id}", HandleDelete)
            .WithSummary($"Delete a record from '{entityName}' table by ID")
            .RequireAuthorization(spec.AuthorizationPolicies);

        app
            .MapGet(routePrefix + "{id}", HandleGet)
            .WithSummary($"Get a(n) '{entityName}' table record by ID")
            .RequireAuthorization(spec.AuthorizationPolicies);

        app
            .MapGet(routePrefix + "/count", HandleGetCount)
            .WithSummary($"Get the '{entityName}' table entity count")
            .RequireAuthorization(spec.AuthorizationPolicies);

        app
            .MapPost(routePrefix + "s", DecorateHandleGetMultiple(spec))
            .WithSummary($"Get filtered and paginated '{entityName}' table record list")
            .RequireAuthorization(spec.AuthorizationPolicies);

        app
            .MapPost(routePrefix, DecorateHandlePost(spec))
            .WithSummary($"Create a new '{entityName}' table record")
            .RequireAuthorization(spec.AuthorizationPolicies);

        app
            .MapPut(routePrefix, DecorateHandlePut(spec))
            .WithSummary($"Update a(n) '{entityName}' table record fields by ID")
            .RequireAuthorization(spec.AuthorizationPolicies);
    }

    private static async Task<IResult> HandleDelete(
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        var found = await dbSet.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        dbSet.Remove(found);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            var entityName = dbSet.EntityType.Name;
            return TypedResults.InternalServerError($"Failed to remove the '{entityName}' table record");
        }
        return TypedResults.NoContent();
    }

    private static async Task<IResult> HandleGet(
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        var found = await dbSet.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }

    private static async Task<IResult> HandleGetCount(
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        return TypedResults.Ok(await dbSet.CountAsync(cancellationToken));
    }

    public record GetMultipleResponse(int PageCount, List<T> Result);

    private static Func<PagedEntityFilterRequest,
                        AppDatabase,
                        CancellationToken,
                        Task<IResult>>
    DecorateHandleGetMultiple(CrudSpecification<T> spec) {
        return async (request, database, cancellationToken) => {
            var dbSet = database.Set<T>();
            IQueryable<T> entities = dbSet.AsQueryable();
            var (pageCount, result) = await entities.ToPagedFilteredListAsync(
                new T(),
                request,
                cancellationToken
            );
            if (pageCount == 0) {
                return TypedResults.NotFound();
            }
            if (spec.ModifyAfterGetMultiple is not null) {
                foreach (var entity in result) {
                    spec.ModifyAfterGetMultiple(entity);
                }
            }
            return TypedResults.Ok(new GetMultipleResponse(pageCount, result));
        };
    }

    private static Func<T,
                        AppDatabase,
                        CancellationToken,
                        Task<IResult>>
    DecorateHandlePost(CrudSpecification<T> spec) {
        return async (request, database, cancellationToken) => {
            var dbSet = database.Set<T>();
            var searchQuery = dbSet.AsQueryable();
            foreach (var property in spec.EnsureUniqueBeforePost) {
                var requestFieldValue = typeof(T).GetProperty(property).GetValue(request).ToString();
                searchQuery = searchQuery.Where($"x => x.{property} == \"{requestFieldValue}\"");
            }
            var found = await searchQuery.FirstOrDefaultAsync(cancellationToken);
            if (found is not null) {
                return TypedResults.Conflict();
            }
            if (spec.EnsureExistsBeforePost is not null) {
                if (!await spec.EnsureExistsBeforePost(request, database, cancellationToken)) {
                    return TypedResults.BadRequest();
                }
            }
            request.Id = 0;
            if (spec.ModifyBeforePost is not null) {
                spec.ModifyBeforePost(request);
            }
            var created = await dbSet.AddAsync(request, cancellationToken);
            var entityName = dbSet.EntityType.Name;
            if (await database.SaveChangesAsync(cancellationToken) == 0) {
                return TypedResults.InternalServerError($"Failed to add a record in '{entityName}' table");
            }
            if (spec.ModifyAfterPost is not null) {
                spec.ModifyAfterPost(request);
            }
            return TypedResults.Created("Post" + entityName, created.CurrentValues.ToObject());
        };
    }

    private static Func<T,
                        AppDatabase,
                        CancellationToken,
                        Task<IResult>>
    DecorateHandlePut(CrudSpecification<T> spec) {
        if (spec.ForbidPut != null) {
            if (spec.ForbidPut == true) {
                return async (request, database, CancellationToken) => TypedResults.Forbid();
            }
        }
        return async (request, database, cancellationToken) => {
            var dbSet = database.Set<T>();
            var found = await dbSet.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
            if (found is null) {
                return TypedResults.NotFound();
            }
            if (spec.ModifyBeforePut is not null) {
                spec.ModifyBeforePut(request, found);
            }
            dbSet.Entry(found).CurrentValues.SetValues(request);
            if (await database.SaveChangesAsync(cancellationToken) == 0) {
                var entityName = dbSet.EntityType.Name;
                return TypedResults.InternalServerError($"Failed to modify the '{entityName}' table record");
            }
            return TypedResults.Ok();
        };
    }

}
