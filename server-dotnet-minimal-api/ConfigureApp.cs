using Microsoft.AspNetCore.CookiePolicy;
using Serilog;

namespace LibAcct;

public static class ConfigureApp {
    public static async Task Configure(this WebApplication app) {
        app.UseSerilogRequestLogging();
        await app.EnsureDatabaseCreated();
        app.UseSwagger();
        app.UseSwaggerUI();
        app.UseHttpsRedirection();
        app.UseStaticFiles();
        app.AddCookiePolicy();
        app.AddCors();
        app.AddAuthentication();
        app.MapEndpoints();
    }

    private static async Task EnsureDatabaseCreated(this WebApplication app) {
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDatabase>();
        await db.Database.MigrateAsync();
        // dotnet ef migrations add *name*
        // dotnet ef database update
    }

    private static void AddCookiePolicy(this WebApplication app) {
        app.UseCookiePolicy(
            new CookiePolicyOptions {
                MinimumSameSitePolicy = SameSiteMode.Strict,
                HttpOnly = HttpOnlyPolicy.None,
                Secure = CookieSecurePolicy.Always,
            }
        );
    }

    private static void AddCors(this WebApplication app) {
        var frontend = app.Configuration["Settings:Frontend"];
        ArgumentNullException.ThrowIfNull(frontend);
        app.UseCors(x => x
            .WithOrigins(frontend)
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader()
        );
    }

    private static void AddAuthentication(this WebApplication app) {
        // authorization header coercing
        app.Use(async (context, next) => {
            var token = context.Request.Cookies["token"];
            Console.WriteLine("[?] AddAuthorizationHeaderCoercing()");
            if (!string.IsNullOrEmpty(token)) {
                Console.WriteLine("[?] AddAuthorizationHeaderCoercing() : token isn't empty");
                context.Request.Headers.Append("Authorization", "Bearer " + token);
            }
            await next();
        });
        app.UseAuthentication();
        app.UseAuthorization();
    }
}