namespace LibAcct.Admin.Endpoints;

public class GetClaim : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/claim/{id}", Handle)
        .WithSummary("Get an userclaim record by ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.UserClaims.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}