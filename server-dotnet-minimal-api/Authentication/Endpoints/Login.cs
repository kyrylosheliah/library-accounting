using LibAcct.Authentication.Services;
using BCrypt.Net;

namespace LibAcct.Authentication.Endpoints;

public class Login : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/login", Handle)
        .WithSummary("Logs in a user")
        .WithRequestValidation<Request>();

    public record Request(string Email, string Password);
    public class RequestValidator : AbstractValidator<Request> {
        public RequestValidator() {
            RuleFor(x => x.Email).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    private static async Task<IResult> Handle(
        HttpContext context,
        Request request,
        AppDatabase database,
        AppSettings settings,
        JwtService jwtService,
        CancellationToken cancellationToken
    ) {
        var user = await database.Users.SingleOrDefaultAsync(
            u => u.Email == request.Email,
            cancellationToken
        );
        if (user is null) {
            return TypedResults.NotFound();
        }
        if (user.LockoutEnabled) {
            return TypedResults.NotFound();
        }
        if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash)) {
            return TypedResults.Unauthorized();
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