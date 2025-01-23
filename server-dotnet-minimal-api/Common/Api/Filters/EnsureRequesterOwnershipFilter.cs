using LibAcct.Authentication.Services;

namespace LibAcct.Common.Api.Filters;

public class EnsureRequesterOwnershipFilter<TRequest, TEntity>(
    AppDatabase database,
    JwtService jwtService,
    Func<TRequest, int> selectEntityId,
    Func<TEntity, int> selectRelationId
) : IEndpointFilter
    where TEntity : class, IEntity {
    public async ValueTask<object?> InvokeAsync(
        EndpointFilterInvocationContext context,
        EndpointFilterDelegate next
    ) {
        var request = context.Arguments.OfType<TRequest>().Single();
        var cancellationToken = context.HttpContext.RequestAborted;
        var userId = jwtService.ExtractUserIdFromToken(context.HttpContext);
        var id = selectEntityId(request);

        var entity = await database
            .Set<TEntity>()
            .Where(x => x.Id == id)
            .SingleOrDefaultAsync(cancellationToken);

        return entity switch {
            null => new NotFoundProblem($"{typeof(TEntity).Name} with id {id} was not found."),
            _ when selectRelationId(entity) != userId => TypedResults.Forbid(),
            _ => await next(context)
        };
    }

    private record Entity(int Id, int UserId);
}