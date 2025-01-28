using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class PostPassword : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/password", Handle)
        .WithSummary("Post password to alter the current logged in user info");

    public record Request(
        string CurrentPassword,
        string Password1,
        string Password2
    );

    private static async Task<IResult> Handle(
        Request request,
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        if (request.Password1 != request.Password2) {
            return TypedResults.BadRequest();
        }
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash);
        if (!isPasswordValid) {
            return TypedResults.Unauthorized();
        }
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password1);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError();
        }
        return TypedResults.Ok();
    }
}