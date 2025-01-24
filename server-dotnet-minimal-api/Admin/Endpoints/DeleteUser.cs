namespace LibAcct.Admin.Endpoints;

public class DeleteUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/user", Handle)
        .WithSummary("Delete a user by ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        int request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.FirstOrDefaultAsync(u => u.Id == request, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        database.Users.Remove(found);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to remove the user record");
        }
        return TypedResults.NoContent();
    }
}