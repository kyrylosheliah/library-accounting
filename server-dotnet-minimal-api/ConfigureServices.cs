using LibAcct.Authentication.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Serilog;
using System.Text.Json.Serialization;

namespace LibAcct;

public static class ConfigureServices {
    public static void AddServices(this WebApplicationBuilder builder) {
        builder.Services.AddCors();
        builder.AddSettings();
        builder.AddJsonOptions();
        builder.AddSerilog();
        builder.AddSwagger();
        builder.AddDatabase();
        builder.Services.AddValidatorsFromAssembly(typeof(ConfigureServices).Assembly);
        builder.AddJwtAuthentication();
    }

    private static void AddSettings(this WebApplicationBuilder builder) {
        builder.Configuration
            .AddJsonFile("appsettings.json", optional: false, reloadOnChange: false)
            .AddJsonFile("secret.json", optional: false, reloadOnChange: false);

        var section = builder.Configuration.GetSection(AppSettings.ParentSection);
        var settings = section.Get<AppSettings>();
        ArgumentNullException.ThrowIfNull(settings);
        builder.Services.AddSingleton(settings);

        // to inject with IOptionsMonitor<AppSettings> instead
        //builder.Services.Configure<AppSettings>(builder.Configuration.GetSection(AppSettings.ParentSection)));
    }

    private static void AddJsonOptions(this WebApplicationBuilder builder) {
        builder.Services.ConfigureHttpJsonOptions(options => {
            //options.SerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles;
            options.SerializerOptions.MaxDepth = 256;
            options.SerializerOptions.PropertyNamingPolicy = null;
        });
    }

    private static void AddSwagger(this WebApplicationBuilder builder) {
        builder.Services.AddEndpointsApiExplorer();
        builder.Services.AddSwaggerGen(options => {
            options.CustomSchemaIds(
                type =>
                    type.FullName?.Replace('+', '.')
                );
            options.InferSecuritySchemes();
        });
        // options in a separate file
        //builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
    }

    private static void AddSerilog(this WebApplicationBuilder builder) {
        builder.Host.UseSerilog((context, configuration) => {
            configuration.ReadFrom.Configuration(context.Configuration);
        });
    }

    private static void AddDatabase(this WebApplicationBuilder builder) {
        builder.Services.AddDbContext<AppDatabase>(options => {
            options.UseNpgsql(
                builder.Configuration.GetConnectionString("PostgreSQL"),
                o => {
                    //o.UseQuerySplittingBehavior(QuerySplittingBehavior.SingleQuery);
                }
            );
        });
    }

    private static void AddJwtAuthentication(this WebApplicationBuilder builder) {
        var jwtKey = builder.Configuration["Settings:Jwt:Key"];
        ArgumentNullException.ThrowIfNull(jwtKey);

        builder.Services
            .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.SaveToken = true;
                options.TokenValidationParameters = new TokenValidationParameters {
                    ClockSkew = TimeSpan.Zero,
                    ValidateIssuer = false, // TODO: true 
                    ValidateAudience = false, // TODO: true
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidIssuer = builder.Configuration["Settings:Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Settings:Jwt:Audience"],
                    IssuerSigningKey = JwtService.SecurityKey(jwtKey),
                };
            }
        );
        builder.Services.AddAuthorization();

        //builder.Services.AddScoped<JwtService>();
    }
}