global using LibAcct.Common.Api;
global using LibAcct.Common.Api.Extensions;
global using LibAcct.Common.Api.Requests;
global using LibAcct.Common.Api.Results;
global using LibAcct.Data;
global using LibAcct.Data.Types;
global using FluentValidation;
global using Microsoft.AspNetCore.Http.HttpResults;
global using Microsoft.EntityFrameworkCore;
global using System.Security.Claims;
using LibAcct;
using Serilog;

Log.Logger = new LoggerConfiguration()
    .WriteTo.Console()
    .CreateBootstrapLogger();

try {
    Log.Information("Starting web application");
    var builder = WebApplication.CreateBuilder(args);
    builder.AddServices();
    var app = builder.Build();
    await app.Configure();
    app.Run();
} catch (Exception ex) when (
    ex.GetType().Name is not "StopTheHostException"
    && ex.GetType().Name is not "HostAbortedException"
) {
    Log.Fatal(ex, "Application terminated unexpectedly");
} finally {
    Log.CloseAndFlush();
}

/*

using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options => {
        options.TokenValidationParameters = new TokenValidationParameters {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "yourissuer.com",
            ValidAudience = "youraudience.com",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKey"))
        };
    });

// builder.Services.AddAuthorization();

// add custom authorizaton policies (1)
builder.Services.AddAuthorization(options => {
    options.AddPolicy("AdminOnly", policy => policy.RequireRole("Admin"));
});

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/", () => "Hello World!");

// add minimal API endpoints
app.MapGet("/api/products", [Authorize] () => {
    return Results.Ok(new[] { "Product1", "Product2" });
});

// secure endpoints with authorization Policies

app.MapGet("/api/secure-products", [Authorize] () => {
    return Results.Ok(new[] { "SecureProduct1", "SecureProduct2" });
}).RequireAuthorization();

// add custom authorization policies (2)
app.MapGet("/api/admin-products", [Authorize(Policy = "AdminOnly")] () => {
    return Results.Ok(new[] { "AdminProduct1", "AdminProduct2" });
});

// implement token generation (1)
app.MapPost("/api/token", (UserLogin login) => {
    if (login.Username == "test" && login.Password == "password") {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("YourSecretKey"));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "yourissuer.com",
            audience: "youraudience.com",
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: credentials);
        
        return Results.Ok(new JwtSecurityTokenHandler().WriteToken(token));
    }
    return Results.Unauthorized();
});

app.Run();

// implement token generation (2)
public record UserLogin(string Username, string Password);

// TODO: add swagger and test endpoints
// TODO: provide jwt token in the Authorizaiton header as Bearer <token>

*/