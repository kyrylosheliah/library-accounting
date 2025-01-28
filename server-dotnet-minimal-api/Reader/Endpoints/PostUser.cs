using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class PostUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/", Handle)
        .WithSummary("Post infromation to alter current logged in user info");

    public record Request(
        string Name,
        string Email,
        string? Phone,
        DateTime? DateOfBirth,
        string? Address,
        char? Gender
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
        database.Users.Entry(user).CurrentValues.SetValues(request);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.BadRequest();
        }
        return TypedResults.Ok();
    }
}