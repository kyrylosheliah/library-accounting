using LibAcct.Data;
using LibAcct.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Dynamic.Core;
using System.Data;

namespace LibAcct.Controllers;

[ApiController]
[Authorize]
[RequiresClaim(ClaimValues.admin, "true")]
[Route("api/admin")]
public class AdminController : ControllerBase
{
    private readonly DataContext _db;

    public AdminController(DataContext dbContext)
    {
        _db = dbContext;
    }

    [HttpGet("user/count")]
    public async Task<ActionResult> GetUserCount()
    {
        return Ok(_db.Users.Count());
    }

    [HttpPost("user")]
    public async Task<IActionResult> PostUser([FromBody] User request)
    {
        var found = _db.Users.FirstOrDefault(e => e.Email == request.Email);
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        request.RegisterDate = DateTime.UtcNow;
        request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
        var created = _db.Users.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        request.PasswordHash = "";
        return Created(nameof(PostUser), created.CurrentValues.ToObject());
    }

    [HttpGet("user/{Id}")]
    public async Task<IActionResult> GetUser(int Id)
    {
        var found = _db.Users.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("user")]
    public async Task<IActionResult> PutUser([FromBody] User request)
    {
        var found = _db.Users.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        if (request.PasswordHash == "")
        {
            request.PasswordHash = found.PasswordHash;
        }
        else
        {
            request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
        }
        _db.Users.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpDelete("user/{Id}")]
    public async Task<IActionResult> DeleteUser(int Id)
    {
        var found = _db.Users.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.Users.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("users")]
    public async Task<IActionResult> GetUsers([FromBody] EntityFilterRequest request)
    {
        IQueryable<User> entities = _db.Users.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.User(),
            request
        );
        var result = queryable
            .ToList()
            .Select(e =>
            {
                e.PasswordHash = "";
                return e;
            });
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpGet("claim/count")]
    public async Task<ActionResult> GetClaimCount()
    {
        return Ok(_db.UserClaims.Count());
    }

    [HttpPost("claim")]
    public async Task<IActionResult> PostClaim([FromBody] UserClaim request)
    {
        var found = _db.UserClaims.FirstOrDefault(
            e => e.UserId == request.UserId && e.Type == request.Type && e.Value == request.Value
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.UserClaims.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostClaim), created.CurrentValues.ToObject());
    }

    [HttpGet("claim/{Id}")]
    public async Task<IActionResult> GetClaim(int Id)
    {
        var found = _db.UserClaims.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("claim")]
    public async Task<IActionResult> PutClaim([FromBody] UserClaim request)
    {
        var found = _db.UserClaims.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.UserClaims.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpDelete("claim/{Id}")]
    public async Task<IActionResult> DeleteClaim(int Id)
    {
        var found = _db.UserClaims.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.UserClaims.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("claims")]
    public async Task<IActionResult> GetClaims([FromBody] EntityFilterRequest request)
    {
        IQueryable<UserClaim> claims = _db.UserClaims.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            claims,
            new Models.UserClaim(),
            request
        );
        var result = queryable.ToList();
        if (pageCount is 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpGet("enrollmentevent/count")]
    public async Task<ActionResult> GetEnrollmentEventCount()
    {
        return Ok(_db.EnrollmentEvents.Count());
    }

    [HttpPost("enrollmentevent")]
    public async Task<IActionResult> PostEnrollmentEvent([FromBody] EnrollmentEvent request)
    {
        var found = _db.EnrollmentEvents.FirstOrDefault(e => e.Event == request.Event);
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.EnrollmentEvents.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostEnrollmentEvent), created.CurrentValues.ToObject());
    }

    [HttpGet("enrollmentevent/{Id}")]
    public async Task<IActionResult> GetEnrollmentEvent(int Id)
    {
        var found = _db.EnrollmentEvents.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("enrollmentevent")]
    public async Task<IActionResult> PutEnrollmentEvent([FromBody] EnrollmentEvent request)
    {
        var found = _db.EnrollmentEvents.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.EnrollmentEvents.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpDelete("enrollmentevent/{Id}")]
    public async Task<IActionResult> DeleteEnrollmentEvent(int Id)
    {
        var found = _db.EnrollmentEvents.FirstOrDefault(e => e.Id == Id);
        if (found == null)
        {
            return NotFound();
        }
        _db.EnrollmentEvents.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("enrollmentevents")]
    public async Task<IActionResult> GetEnrollmentEvents([FromBody] EntityFilterRequest request)
    {
        IQueryable<EnrollmentEvent> entities = _db.EnrollmentEvents.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.EnrollmentEvent(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("enrollment")]
    public async Task<IActionResult> PostEnrollment([FromBody] Enrollment request)
    {
        var found = _db.Enrollments.FirstOrDefault(e => e.Event == request.Event);
        if (found is not null)
        {
            return Conflict();
        }
        var userFound = _db.Users.FirstOrDefault(e => e.Id == request.StaffId);
        if (userFound is null)
        {
            return BadRequest();
        }
        request.Id = 0;
        request.EventDate = DateTime.UtcNow;
        var created = _db.Enrollments.Add(request);
        _db.UserClaims.Add(
            new UserClaim()
            {
                Id = 0,
                UserId = request.StaffId,
                Type = "librarian",
                Value = "true"
            }
        );
        if (await _db.SaveChangesAsync() < 2)
        {
            return BadRequest();
        }
        return Created(nameof(PostEnrollment), created.CurrentValues.ToObject());
    }

    [HttpGet("enrollment/{Id}")]
    public async Task<IActionResult> GetEnrollment(int Id)
    {
        var found = _db.Enrollments.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("enrollment")]
    public async Task<IActionResult> PutEnrollment([FromBody] Enrollment request)
    {
        return BadRequest();
    }

    [HttpDelete("enrollment/{Id}")]
    public async Task<IActionResult> DeleteEnrollment(int Id)
    {
        var found = _db.Enrollments.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.Enrollments.Remove(found);
        var claimFound = _db.UserClaims.FirstOrDefault(
            e => e.UserId == found.StaffId && e.Value == "librarian"
        );
        if (claimFound is not null)
        {
            _db.UserClaims.Remove(claimFound);
        }
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("enrollments")]
    public async Task<IActionResult> GetEnrollments([FromBody] EntityFilterRequest request)
    {
        IQueryable<Enrollment> entities = _db.Enrollments.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Enrollment(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }
}
