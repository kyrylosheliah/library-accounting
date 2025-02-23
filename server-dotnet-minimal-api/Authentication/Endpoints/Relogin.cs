using LibAcct.Authentication.Services;

namespace LibAcct.Authentication.Endpoints;

public class Relogin : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/relogin", Handle)
        .WithSummary("Relogs a user if there's a valid token cookie present");

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        AppSettings settings,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound();
        }
        if (user.LockoutEnabled) {
            return TypedResults.NotFound();
        }
        JwtService.AppendProtectionHeaders(context.Response.Headers);
        var token = await JwtService.CreateToken(user, settings, database);
        JwtService.ApplyToken(context, settings, token);
        return TypedResults.Ok();
    }
}