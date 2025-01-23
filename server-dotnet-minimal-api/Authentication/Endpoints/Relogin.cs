using LibAcct.Authentication.Services;
using BCrypt.Net;
using System.IdentityModel.Tokens.Jwt;

namespace LibAcct.Authentication.Endpoints;

public class Relogin : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/relogin", Handle)
        .WithSummary("Relogs a user if there's a valid token cookie present");

    public record Request(int Id);

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        AppSettings settings,
        JwtService jwtService,
        CancellationToken cancellationToken
    ) {
        var userId = jwtService.ExtractUserIdFromToken(context);
        if (userId is null) {
            return TypedResults.BadRequest();
        }
        var user = await database.Users.FirstOrDefaultAsync(u => u.Id == userId, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound();
        }
        if (user.LockoutEnabled) {
            return TypedResults.NotFound();
        }
        jwtService.AppendProtectionHeaders(context.Response.Headers);
        var token = jwtService.CreateToken(user, settings, database);
        context.Response.Cookies.Append(
            "token",
            token,
            new CookieOptions {
                MaxAge = TimeSpan.FromMinutes(settings.Jwt.ExpirationMinutes),
                SameSite = SameSiteMode.Strict,
                HttpOnly = false
            }
        );
        return TypedResults.Ok();
    }
}