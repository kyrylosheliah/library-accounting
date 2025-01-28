using LibAcct.Authentication.Services;
using LibAcct.Reader.Services;

namespace LibAcct.Reader.Endpoints;

public class GetUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/", Handle)
        .WithSummary("Get current logged in user info");

    public record Response(User User, FileContentHttpResult? File);

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        var avatarFile = await AvatarService.ReadUserAvatar(user.Id);
        user.PasswordHash = "";
        if (avatarFile is null) {
            return TypedResults.Ok(new Response(user, null));
        }
        return TypedResults.Ok(new Response(user, avatarFile));
    }
}