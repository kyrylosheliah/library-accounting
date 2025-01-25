namespace LibAcct.Admin.Endpoints;

public class GetClaim : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/claim/{id}", Handle)
        .WithSummary("Get userclaim by ID (other fields are ignored)")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.Include(u => u.UserClaims).FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}