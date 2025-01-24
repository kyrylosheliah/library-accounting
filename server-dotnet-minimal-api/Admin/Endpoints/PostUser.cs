namespace LibAcct.Admin.Endpoints;

public class PostUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/user", Handle)
        .WithSummary("Count Users table entities")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        User request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users.FirstOrDefaultAsync(u => u.Email == request.Email, cancellationToken);
        if (found is not null) {
            return TypedResults.Conflict();
        }
        request.Id = 0;
        request.RegisterDate = DateTime.UtcNow;
        request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
        var created = await database.Users.AddAsync(request, cancellationToken);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to add a user record");
        }
        request.PasswordHash = "";
        return TypedResults.Created(nameof(PostUser), created.CurrentValues.ToObject());
    }
}