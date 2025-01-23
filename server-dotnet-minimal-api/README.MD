# Library Accounting ASP.NET Core minimal APIs backend

This library accounting backend uses minimal APIs to implement Vertical Slice Architecture. (Thanks to [jonowilliams26/StructuredMinimalApi](https://github.com/jonowilliams26/StructuredMinimalApi))

The Entity Framework is configured to use PostgreSQL.

## Sample JSON configuration files

appsettings.json:
```json
{
  "Settings": {
    "Jwt": {
      "Audience": "https://localhost:5000d",
      "ExpirationMinutes": 30,
      "Issuer": "https://localhost:3000"
    },
    "Frontend": "http://localhost:3000"
  },
  // ...
}
```

secret.json:
```json
{
  "ConnectionStrings": {
    "PostgreSQL": "Host=localhost:5433;Database=LibraryAccounting;Username=postgres;Password=password"
  },
  "Settings": {
    "Jwt": {
      "Key": "abc123"
    }
  }
}
```