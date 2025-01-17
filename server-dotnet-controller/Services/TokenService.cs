using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using LibAcct.Data;
using LibAcct.Models;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace LibAcct.Services;

public class TokenService
{
    public readonly int ExpirationMinutes;
    private readonly ConfigurationContext _config;
    private readonly DataContext _db;

    public TokenService(IOptions<ConfigurationContext> config, DataContext dbContext)
    {
        _config = config.Value;
        _db = dbContext;
        ExpirationMinutes = config.Value.JwtKeyExpirationMinutes;
    }

    public string CreateToken(User user)
    {
        var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0);
        var now = DateTime.UtcNow;
        var expires = now.AddMinutes((double)ExpirationMinutes);
        var nbf = (int)(now - unixEpoch).TotalSeconds;
        var exp = (int)(expires - unixEpoch).TotalSeconds;
        var claims = new List<Claim>
        {
            new Claim("jti", Guid.NewGuid().ToString()),
            new Claim("nbf", nbf.ToString()),
            new Claim("exp", exp.ToString()),
            new Claim("uid", user.Id.ToString()),
        };
        var userClaims = _db.UserClaims.Where(uc => uc.UserId == user.Id);
        if (userClaims != null)
        {
            foreach (var userClaim in userClaims)
            {
                claims.Add(new Claim(userClaim.Type, userClaim.Value));
            }
        }
        var token = new JwtSecurityToken(
            issuer: _config.JwtIssuer,
            audience: _config.JwtAudience,
            claims: claims,
            expires: expires,
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.JwtKey)),
                SecurityAlgorithms.HmacSha256
            )
        );
        var tokenHandler = new JwtSecurityTokenHandler();
        return tokenHandler.WriteToken(token);
    }
}
