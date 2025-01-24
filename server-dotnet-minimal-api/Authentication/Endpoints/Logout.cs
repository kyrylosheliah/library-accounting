namespace LibAcct.Authentication.Endpoints;

public class Logout : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/logout", Handle)
        .WithSummary("Logs out a user by erasing the token cookie");

    private static Ok Handle(
        HttpContext context
    ) {
        context.Response.Cookies.Delete("token");
        /*context.Response.Cookies.Append(
            "token",
            "",
            new CookieOptions { SameSite = SameSiteMode.Strict, HttpOnly = false }
        );*/
        return TypedResults.Ok();
    }
}