namespace LibAcct.Data;

public class AppSettings
{
    public const string ParentSection = "Settings";
    public JwtSettings Jwt { get; set; } = null!;
    public string Frontend { get; set; } = null!;
}

public class JwtSettings {
    public string Issuer { get; set; } = null!;
    public string Audience { get; set; } = null!;
    public string Key { get; set; } = null!;
    public int ExpirationMinutes { get; set; }
}