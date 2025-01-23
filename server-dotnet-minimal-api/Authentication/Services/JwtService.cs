using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;

namespace LibAcct.Authentication.Services;

public class JwtService { 

    public static SymmetricSecurityKey SecurityKey(string key) => new(Encoding.ASCII.GetBytes(key));

    public string CreateToken(
        User user,
        AppSettings settings,
        AppDatabase database
    ) {
        var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0);
        var now = DateTime.UtcNow;
        var expires = now.AddMinutes(settings.Jwt.ExpirationMinutes);
        var nbf = (int)(now - unixEpoch).TotalSeconds;
        var exp = (int)(expires - unixEpoch).TotalSeconds;
        var claims = new List<Claim> {
            new ("jti", Guid.NewGuid().ToString()),
            new ("nbf", nbf.ToString()),
            new ("exp", exp.ToString()),
            new ("uid", user.Id.ToString()),
            //new ("iss", "localhost:5000"), // TODO: extract from settings
            //new ("aud", "localhost:5000"), // TODO: extract from settings
        };
        var userClaims = database.UserClaims
            .Where(uc => uc.UserId == user.Id).AsEnumerable();
        if (userClaims != null) {
            foreach (var userClaim in userClaims) {
                claims.Add(new Claim(userClaim.Type, userClaim.Value));
            }
        }
        var token = new JwtSecurityToken(
            issuer: settings.Jwt.Issuer,
            audience: settings.Jwt.Audience,
            claims: claims,
            expires: expires,
            signingCredentials: new(
                SecurityKey(settings.Jwt.Key),
                SecurityAlgorithms.HmacSha256Signature
            )
        );
        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public void AppendProtectionHeaders(IHeaderDictionary headers) {
        headers.Append("X-Content-Type-Options", "nosniff");
        headers.Append("X-Xss-Protection", "1");
        headers.Append("X-Frame-Options", "DENY");
    }

    public int? ExtractUserIdFromToken(HttpContext context) {
        var requestToken = new JwtSecurityToken(context.Request.Cookies["token"]);
        var userIdClaim = requestToken.Claims.SingleOrDefault(c => c.Type == "uid");
        if (userIdClaim is null) {
            return null;
        }
        int userId;
        if (!int.TryParse(userIdClaim.Value, out userId)) {
            return null;
        }
        return userId;
    }
}