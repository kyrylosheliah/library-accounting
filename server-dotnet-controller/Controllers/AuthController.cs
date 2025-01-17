using System.IdentityModel.Tokens.Jwt;
using LibAcct.Data;
using LibAcct.Models;
using LibAcct.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LibAcct.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly DataContext _db;
    private readonly TokenService _tokenService;

    public AuthController(DataContext dbContext, TokenService tokenService)
    {
        _db = dbContext;
        _tokenService = tokenService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        request.email = request.email.ToLower();
        var found = _db.Users.FirstOrDefault(u => u.Email == request.email);
        if (found is not null)
        {
            return Conflict();
        }
        request.password = BCrypt.Net.BCrypt.HashPassword(request.password);
        var user = _db.Users.Add(
            new User
            {
                Email = request.email,
                Name = request.name,
                PasswordHash = request.password,
                LockoutEnabled = false,
                RegisterDate = DateTime.UtcNow
            }
        );
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        request.password = "";
        return CreatedAtAction(nameof(Register), new { email = request.email }, request);
    }

    [HttpPost("login")]
    public async Task<ActionResult> LogIn([FromBody] LogInRequest request)
    {
        request.email = request.email.ToLower();
        var userRecord = _db.Users.FirstOrDefault<User>(u => u.Email == request.email);
        if (userRecord is null)
        {
            return NotFound();
        }
        if (userRecord.LockoutEnabled)
        {
            return NotFound();
        }
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.password, userRecord.PasswordHash);
        if (!isPasswordValid)
        {
            return BadRequest();
        }
        HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        HttpContext.Response.Headers.Add("X-Xss-Protection", "1");
        HttpContext.Response.Headers.Add("X-Frame-Options", "DENY");
        var token = _tokenService.CreateToken(userRecord);
        HttpContext.Response.Cookies.Append(
            "token",
            token,
            new CookieOptions
            {
                MaxAge = TimeSpan.FromMinutes(_tokenService.ExpirationMinutes),
                SameSite = SameSiteMode.Strict,
                HttpOnly = false
            }
        );
        return Ok();
    }

    [Authorize]
    [HttpPost("relogin")]
    public async Task<ActionResult> ReLogIn()
    {
        var requestTokenEncoded = HttpContext.Request.Cookies["token"];
        var requestToken = new JwtSecurityToken(requestTokenEncoded);
        var userIdClaim = requestToken.Claims.FirstOrDefault(c => c.Type == "uid");
        if (userIdClaim is null)
        {
            return BadRequest();
        }
        int userID;
        if (!int.TryParse(userIdClaim.Value, out userID))
        {
            return BadRequest();
        }
        var userRecord = _db.Users.FirstOrDefault<User>(u => u.Id == userID);
        if (userRecord is null)
        {
            return NotFound();
        }
        if (userRecord.LockoutEnabled)
        {
            return NotFound();
        }
        HttpContext.Response.Headers.Add("X-Content-Type-Options", "nosniff");
        HttpContext.Response.Headers.Add("X-Xss-Protection", "1");
        HttpContext.Response.Headers.Add("X-Frame-Options", "DENY");
        var token = _tokenService.CreateToken(userRecord);
        HttpContext.Response.Cookies.Append(
            "token",
            token,
            new CookieOptions
            {
                MaxAge = TimeSpan.FromMinutes(_tokenService.ExpirationMinutes),
                SameSite = SameSiteMode.Strict,
                HttpOnly = false
            }
        );
        return Ok();
    }

    [HttpPost("logout")]
    public async Task<ActionResult> LogOut()
    {
        HttpContext.Response.Cookies.Delete("token");
        /*HttpContext.Response.Cookies.Append(
            "token",
            "",
            new CookieOptions { SameSite = SameSiteMode.Strict, HttpOnly = false }
        );
        */
        return Ok();
    }
}
