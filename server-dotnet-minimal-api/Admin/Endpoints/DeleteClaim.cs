namespace LibAcct.Admin.Endpoints;

public class DeleteClaim : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/claim/{id}", Handle)
        .WithSummary("Delete a userclaim by ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.UserClaims.FirstOrDefaultAsync(u => u.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        database.UserClaims.Remove(found);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to remove the user record");
        }
        return TypedResults.NoContent();
    }
}