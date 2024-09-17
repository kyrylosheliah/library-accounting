# Library Accounting

Library accounting is made with ASP.NET Web API as a backend and web app as a frontend.

Two attempts on the frontend part were made. The first is made with React and the second is made with SolidJS.

Entity Framework is configured to be used with PostgreSQL.

## secret.json

The backend app uses a secret.json file aside from appsettings.json to load some parameters.

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