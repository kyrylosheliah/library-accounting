using LibAcct.Authentication.Endpoints;
using LibAcct.Common.Api.Filters;
//using LibAcct.Posts.Endpoints;
//using LibAcct.Users.Endpoints;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;

namespace LibAcct;

public static class Endpoints {
    private static readonly OpenApiSecurityScheme securityScheme = new() {
        Type = SecuritySchemeType.Http,
        Name = JwtBearerDefaults.AuthenticationScheme,
        Scheme = JwtBearerDefaults.AuthenticationScheme,
        Reference = new() {
            Type = ReferenceType.SecurityScheme,
            Id = JwtBearerDefaults.AuthenticationScheme
        }
    };

    public static void MapEndpoints(this WebApplication app) {
        var endpoints = app.MapGroup("")
            .AddEndpointFilter<RequestLoggingFilter>()
            .WithOpenApi();

        endpoints.MapAuthenticationEndpoints();
        //endpoints.MapPostEndpoints();
        //endpoints.MapCommentEndpoints();
        //endpoints.MapUserEndpoints();
    }

    private static IEndpointRouteBuilder MapEndpoint<TEndpoint>(this IEndpointRouteBuilder app) where TEndpoint : IEndpoint {
        TEndpoint.Map(app);
        return app;
    }

    private static RouteGroupBuilder MapPublicGroup(this IEndpointRouteBuilder app, string? prefix = null) {
        return app.MapGroup(prefix ?? string.Empty)
            .AllowAnonymous();
    }

    private static RouteGroupBuilder MapAuthorizedGroup(this IEndpointRouteBuilder app, string? prefix = null) {
        return app.MapGroup(prefix ?? string.Empty)
            .RequireAuthorization()
            .WithOpenApi(x => new(x) {
                Security = [new() { [securityScheme] = [] }],
            });
    }

    private static void MapAuthenticationEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/auth")
            .WithTags("Authentication");

        endpoints.MapPublicGroup()
            .MapEndpoint<Signup>()
            .MapEndpoint<Login>();

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<Relogin>()
            .MapEndpoint<Logout>();
    }
}