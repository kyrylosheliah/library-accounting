using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using LibAcct.Authentication.Endpoints;
using LibAcct.Admin.Endpoints;
using LibAcct.Librarian.Endpoints;
using LibAcct.Reader.Endpoints;
using LibAcct.Library.Endpoints;

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
        var endpoints = app.MapGroup("/api")
            .AddEndpointFilter<RequestLoggingFilter>()
            .WithOpenApi();

        endpoints.MapAuthenticationEndpoints();
        endpoints.MapAdminEndpoints();
        endpoints.MapLibrarianEndpoints();
        endpoints.MapUserEndpoints();
        endpoints.MapLibraryEndpoints();
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

    private static void MapAdminEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/admin")
            .WithTags("Admin");

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<CrudUser>()
            .MapEndpoint<CrudClaim>()
            .MapEndpoint<CrudEnrollmentEvent>()
            .MapEndpoint<CrudEnrollment>();
    }

    private static void MapLibrarianEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/librarian")
            .WithTags("Librarian");

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<DeleteBookCover>()
            .MapEndpoint<GetBookCover>()
            .MapEndpoint<PostBookCover>()
            .MapEndpoint<PostDebtBorrow>()
            .MapEndpoint<PostShelfSupply>()
            .MapEndpoint<CrudAppointment>()
            .MapEndpoint<CrudBook>()
            .MapEndpoint<CrudBorrow>()
            .MapEndpoint<CrudBorrowItem>()
            .MapEndpoint<CrudCategory>()
            .MapEndpoint<CrudReturn>()
            .MapEndpoint<CrudReturnItem>()
            .MapEndpoint<CrudSupplier>()
            .MapEndpoint<CrudSupply>()
            .MapEndpoint<CrudSupplyItem>();
    }

    private static void MapUserEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/user")
            .WithTags("User");

        endpoints.MapAuthorizedGroup()
            .MapEndpoint<DeleteAvatar>()
            .MapEndpoint<DeleteWish>()
            .MapEndpoint<GetBorrows>()
            .MapEndpoint<GetDebts>()
            .MapEndpoint<GetMembership>()
            .MapEndpoint<GetReturns>()
            .MapEndpoint<GetUser>()
            .MapEndpoint<GetWish>()
            .MapEndpoint<GetWishes>()
            .MapEndpoint<PostAvatar>()
            .MapEndpoint<PostMembershipTransaction>()
            .MapEndpoint<PostPassword>()
            .MapEndpoint<PostUser>()
            .MapEndpoint<PostWish>();
    }

    private static void MapLibraryEndpoints(this IEndpointRouteBuilder app) {
        var endpoints = app.MapGroup("/library")
            .WithTags("Library");

        endpoints.MapPublicGroup()
            .MapEndpoint<GetBook>()
            .MapEndpoint<GetCategories>()
            .MapEndpoint<GetCategory>()
            .MapEndpoint<PostSearch>();
    }
}