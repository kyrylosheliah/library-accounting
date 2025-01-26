namespace LibAcct.App.Endpoint.Extensions;

public static class RouteHandlerBuilderValidationExtensions {
    public static RouteHandlerBuilder WithRequestValidation<TRequest>(this RouteHandlerBuilder builder) {
        return builder
            .AddEndpointFilter<RequestValidationFilter<TRequest>>()
            .ProducesValidationProblem();
    }

    public static RouteHandlerBuilder WithEnsureEntityExists<TEntity, TRequest>(this RouteHandlerBuilder builder, Func<TRequest, int?> idSelector) where TEntity : class, IEntity {
        return builder
            .AddEndpointFilterFactory((endpointFilterFactoryContext, next) => async context => {
                var database = context.HttpContext.RequestServices.GetRequiredService<AppDatabase>();
                var filter = new EnsureEntityExistsFilter<TRequest, TEntity>(database, idSelector);
                return await filter.InvokeAsync(context, next);
            }).ProducesProblem(StatusCodes.Status404NotFound);
    }

    public static RouteHandlerBuilder WithEnsureUserOwnsEntity<TRequest, TEntity>(
        this RouteHandlerBuilder builder,
        Func<TRequest, int> selectEntityId,
        Func<TEntity, int> selectRelationId
    ) where TEntity : class, IEntity {
        return builder
            .AddEndpointFilterFactory((endpointFilterFactoryContext, next) => async context => {
                var database = context.HttpContext.RequestServices.GetRequiredService<AppDatabase>();
                var filter = new EnsureUserOwnsEntityFilter<TRequest, TEntity>(
                    database,
                    selectEntityId,
                    selectRelationId
                );
                return await filter.InvokeAsync(context, next);
            })
            .ProducesProblem(StatusCodes.Status404NotFound)
            .Produces(StatusCodes.Status403Forbidden);
    }
}