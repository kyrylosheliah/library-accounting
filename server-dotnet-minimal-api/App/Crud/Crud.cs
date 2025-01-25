namespace LibAcct.App.Crud;

public class CrudSettings {
    public string[] AuthorizationPolicies { get; set; } = [];
}

public class Crud<T> where T : class, IEntity, new() {

    public static void Map(
        IEndpointRouteBuilder app,
        CrudSettings settings
    ) {
        var entityName = typeof(T).Name;
        var routePrefix = "/" + entityName.ToLower();

        app
            .MapDelete(routePrefix + "{id}", HandleDelete)
            .WithSummary($"Delete a record from '{entityName}' table by ID")
            .RequireAuthorization(settings.AuthorizationPolicies);

        app
            .MapGet(routePrefix + "{id}", HandleGet)
            .WithSummary($"Get a(n) '{entityName}' table record by ID")
            .RequireAuthorization(settings.AuthorizationPolicies);

        app
            .MapGet(routePrefix + "/count", HandleGetCount)
            .WithSummary($"Get the '{entityName}' table entity count")
            .RequireAuthorization(settings.AuthorizationPolicies);

        app
            .MapPost(routePrefix + "s", HandleGetMultiple)
            .WithSummary($"Get filtered and paginated '{entityName}' table record list")
            .RequireAuthorization(settings.AuthorizationPolicies);

        app
            .MapPost(routePrefix, HandlePost)
            .WithSummary($"Create a new '{entityName}' table record")
            .RequireAuthorization(settings.AuthorizationPolicies);

        app
            .MapPut(routePrefix, HandlePut)
            .WithSummary($"Update a(n) '{entityName}' table record fields by ID")
            .RequireAuthorization("IsAdmin");
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

    private static async Task<IResult> HandleGetMultiple(
        PagedEntityFilterRequest request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        IQueryable<T> entities = dbSet.AsQueryable();
        var (pageCount, result) = await entities.ToPagedFilteredListAsync(
            new T(),
            request,
            cancellationToken
        );
        // User table records require sanitization
        /*result = result
            .Select(
                x => {
                    x.PasswordHash = "";
                    return x;
                })
            .ToList();*/
        if (pageCount == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(new GetMultipleResponse(pageCount, result));
    }

    private static async Task<IResult> HandlePost(
        T request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        var found = await dbSet.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
        // User table records should be selected as unique by specific field
        //var found = await dbSet.FirstOrDefaultAsync(x => x.Email == request.Email, cancellationToken);
        if (found is not null) {
            return TypedResults.Conflict();
        }
        request.Id = 0;
        // User table records should be initialized in an unique way
        /*request.RegisterDate = DateTime.UtcNow;
        request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);*/
        var created = await dbSet.AddAsync(request, cancellationToken);
        var entityName = dbSet.EntityType.Name;
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError($"Failed to add a record in '{entityName}' table");
        }
        // User table record fields should be reset when returning back to frontend
        //request.PasswordHash = "";
        return TypedResults.Created("Post" + entityName, created.CurrentValues.ToObject());
    }

    private static async Task<IResult> HandlePut(
        T request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var dbSet = database.Set<T>();
        var found = await dbSet.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        // User table record fileds should be sanitized when there is an intention to put new password field
        /*if (request.PasswordHash.Length == 0) {
            request.PasswordHash = found.PasswordHash;
        } else {
            request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
        }*/
        dbSet.Entry(found).CurrentValues.SetValues(request);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            var entityName = dbSet.EntityType.Name;
            return TypedResults.InternalServerError($"Failed to modify the '{entityName}' table record");
        }
        return TypedResults.Ok();
    }

}
