namespace LibAcct.Admin.Endpoints;

public class GetUserCount : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/user/count", Handle)
        .WithSummary("Count Users table entities")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        return TypedResults.Ok(await database.Users.CountAsync(cancellationToken));
    }
}