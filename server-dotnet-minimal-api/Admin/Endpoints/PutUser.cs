namespace LibAcct.Admin.Endpoints;

public class PutUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/user", Handle)
        .WithSummary("Put user data at the entity with the same ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        User request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.FirstOrDefaultAsync(u => u.Id == request.Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        if (request.PasswordHash.Length == 0) {
            request.PasswordHash = found.PasswordHash;
        } else {
            request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
        }
        database.Users.Entry(found).CurrentValues.SetValues(request);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to modify the user record");
        }
        return TypedResults.Ok();
    }
}