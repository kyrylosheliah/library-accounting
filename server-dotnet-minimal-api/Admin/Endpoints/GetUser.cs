namespace LibAcct.Admin.Endpoints;

public class GetUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/user", Handle)
        .WithSummary("Get user by ID (other fields are ignored)")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        int request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.Include(u => u.UserClaims).FirstOrDefaultAsync(u => u.Id == request, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}