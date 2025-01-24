namespace LibAcct.Admin.Endpoints;

public class GetClaimCount : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/claim/count", Handle)
        .WithSummary("Count Claim table entities")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        return TypedResults.Ok(await database.UserClaims.CountAsync(cancellationToken));
    }
}