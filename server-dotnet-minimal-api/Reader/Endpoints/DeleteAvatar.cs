using LibAcct.Authentication.Services;
using LibAcct.Reader.Services;

namespace LibAcct.Reader.Endpoints;

public class DeleteAvatar : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/avatar", Handle)
        .WithSummary("Delete current avatar");

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        try {
            AvatarService.DeleteUserAvatar(user.Id);
        } catch (Exception e) {
            return TypedResults.BadRequest(e);
        }
        return TypedResults.Ok();
    }
}