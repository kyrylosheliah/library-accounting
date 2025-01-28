using LibAcct.Authentication.Services;
using LibAcct.Reader.Services;

namespace LibAcct.Reader.Endpoints;

public class PostAvatar : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/avatar", Handle)
        .WithSummary("Post new avatar");

    private static async Task<IResult> Handle(
        IFormFile request,
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        try {
            AvatarService.WriteUserAvatar(user.Id, request);
        } catch (Exception e) {
            return TypedResults.BadRequest(e);
        }
        return TypedResults.Ok();
    }
}