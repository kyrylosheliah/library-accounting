namespace LibAcct.Data;

public class ConfigurationContext
{
    public string DBCS { get; set; } = null!;
    public string JwtIssuer { get; set; } = null!;
    public string JwtAudience { get; set; } = null!;
    public string JwtKey { get; set; } = null!;
    public int JwtKeyExpirationMinutes { get; set; }
    public string Frontend { get; set; } = null!;
}
