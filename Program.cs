using System.Text;
using LibAcct.Data;
using LibAcct.Services;
using LibAcct.Swagger;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.CookiePolicy;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Swashbuckle.AspNetCore.SwaggerGen;

var builder = WebApplication.CreateBuilder(args);
var services = builder.Services;

builder.Configuration.AddJsonFile("secret.json", optional: false, reloadOnChange: false);
var config = builder.Configuration;

services.AddEndpointsApiExplorer();
services.AddSwaggerGen();
services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();

services
    .AddControllers()
    .AddJsonOptions(options =>
    {
        //options.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
        options.JsonSerializerOptions.MaxDepth = 256;
        options.JsonSerializerOptions.PropertyNamingPolicy = null;
    });

//.AddJsonOptions(x => x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.SaveToken = true;
        options.TokenValidationParameters = new TokenValidationParameters()
        {
            ClockSkew = TimeSpan.Zero,
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = config["Settings:JwtIssuer"],
            ValidAudience = config["Settings:JwtAudience"],
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(config["Settings:JwtKey"])
            ),
        };
    });

services.AddDbContext<DataContext>();
services.AddScoped<TokenService>();
services.Configure<ConfigurationContext>(config.GetSection("Settings"));

var app = builder.Build();
var env = app.Environment;

if (env.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

//app.UseHttpsRedirection();

app.UseStaticFiles();

app.UseCookiePolicy(
    new CookiePolicyOptions
    {
        MinimumSameSitePolicy = Microsoft.AspNetCore.Http.SameSiteMode.Strict,
        HttpOnly = HttpOnlyPolicy.None,
        Secure = CookieSecurePolicy.Always,
    }
);

app.UseCors(
    x =>
        x.WithOrigins(config["Settings:Frontend"])
            .AllowCredentials()
            .AllowAnyMethod()
            .AllowAnyHeader()
);

app.Use(
    async (context, next) =>
    {
        var token = context.Request.Cookies["token"];
        if (!string.IsNullOrEmpty(token))
        {
            context.Request.Headers.Add("Authorization", "Bearer " + token);
        }
        await next();
    }
);

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
