namespace LibAcct.Admin.Endpoints;

public class GetUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/user/{id}", Handle)
        .WithSummary("Get a user record by ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}