using LibAcct.Authentication.Services;

namespace LibAcct.Authentication.Endpoints;

public class Signup : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/signup", Handle)
        .WithSummary("Creates a new user account")
        .WithRequestValidation<Request>();

    public record Request(string Email, string Name, string Password);
    public record Response(string Route, string Email, Request Request);
    public class RequestValidator : AbstractValidator<Request> {
        public RequestValidator() {
            RuleFor(x => x.Email).NotEmpty();
            RuleFor(x => x.Name).NotEmpty();
            RuleFor(x => x.Password).NotEmpty();
        }
    }

    public static async Task<IResult> Handle(
        Request request,
        AppDatabase database,
        AppSettings settings,
        JwtService jwtService,
        CancellationToken cancellationToken
    ) {
        var found = await database.Users
            .AnyAsync(u => u.Email == request.Email, cancellationToken);
        if (found) {
            return TypedResults.Conflict("E-mail is already taken");
        }
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);
        if (passwordHash is null) {
            // should be unreachable after validation
            return TypedResults.BadRequest("Failed to encrypt the password");
        }
        var user = new User {
            Email = request.Email,
            Name = request.Name,
            PasswordHash = passwordHash,
            LockoutEnabled = false,
            RegisterDate = DateTime.UtcNow
        };
        await database.Users.AddAsync(user, cancellationToken);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.BadRequest("Failed to create a user");
        }
        //var token = jwtService.CreateToken(user, settings, database);
        var response = new Response(nameof(Signup), user.Email, request);
        return TypedResults.CreatedAtRoute(response);
    }
}