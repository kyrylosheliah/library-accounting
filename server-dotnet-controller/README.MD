# Library accounting ASP.NET Core Web API backend

This library accounting backend uses isolated Controller capabilities of the framework MVC infrastructure.

The Entity Framework is configured to use PostgreSQL.

## Sample JSON configuration files

appsettings.json:
```json
{
  "Settings": {
    "JwtKeyExpirationMinutes": 30,
    "Frontend": "http://localhost:3000"
  },
  // ...
}
```

secret.json:
```json
{
  "Settings": {
    "DBCS": "Host=localhost:5432;Database=library_accounting;Username=postgres;Password=password",
    "JwtIssuer": "https://localhost:5000",
    "JwtAudience": "https://localhost:3000",
    "JwtKey": "abc123"
  }
}
```