using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace LibAcct.Swagger;

public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
{
    public void Configure(SwaggerGenOptions options)
    {
        options.SwaggerDoc("v1", new OpenApiInfo { Title = "Demo API", Version = "v1" });
        options.AddSecurityDefinition(
            "Bearer",
            new OpenApiSecurityScheme
            {
                In = ParameterLocation.Header,
                Description = "Please enter a valid token",
                Name = "Authorization",
                Type = SecuritySchemeType.Http,
                BearerFormat = "JWT",
                Scheme = "Bearer"
            }
        );
        options.AddSecurityRequirement(
            new OpenApiSecurityRequirement
            {
                {
                    new OpenApiSecurityScheme
                    {
                        Reference = new OpenApiReference
                        {
                            Type = ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                    },
                    new string[] { }
                }
            }
        );

        options.CustomSchemaIds(
            type =>
                string.Join(
                    '.',
                    new[] { type.ReflectedType?.Name, type.Name }.Where(x => x != null)
                )
        );
        /*var defaultSchemaIdSelector = options.SchemaGeneratorOptions.SchemaIdSelector;
        options.CustomSchemaIds(modelType =>
        {
            var defaultId = defaultSchemaIdSelector(modelType);
            var prefix = modelType.Namespace?.Split(".").Last();
            return String.IsNullOrEmpty(prefix) ? defaultId : String.Concat(prefix, ".", defaultId);
        });*/
    }
}
