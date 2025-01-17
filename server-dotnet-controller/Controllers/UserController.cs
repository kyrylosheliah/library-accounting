using LibAcct.Data;
using LibAcct.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibAcct.Controllers;

[ApiController]
[Authorize]
[Route("api/user")]
public class UserController : ControllerBase
{
    private readonly DataContext _db;

    public UserController(DataContext dbContext)
    {
        _db = dbContext;
    }

    [HttpGet]
    public async Task<ActionResult> Get()
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var result = await Helpers.ReadUserAvatar(user.Id);
        if (result is null)
        {
            return Ok(new { user = Models.User.PasswordlessClone(user), file = "undefined" });
        }
        var avatar = File(result.Value.Item1, result.Value.Item2);
        return Ok(new { user = Models.User.PasswordlessClone(user), avatar });
    }

    [HttpPost]
    public async Task<IActionResult> Post([FromBody] UserFormRequest request)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        _db.Users.Entry(user).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpPost("avatar")]
    public async Task<IActionResult> PostAvatar(IFormFile file)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        try
        {
            Helpers.WriteUserAvatar(user.Id, file);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        return Ok();
    }

    [HttpDelete("avatar")]
    public async Task<IActionResult> DeleteAvatar()
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        try
        {
            Helpers.DeleteUserAvatar(user.Id);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        return Ok();
    }

    [HttpPost("password")]
    public async Task<IActionResult> PostPassword(ChangePasswordRequest request)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.currentPassword, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Unauthorized();
        }
        if (request.password1 != request.password2)
        {
            return BadRequest();
        }
        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.password1);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpGet("debts")]
    public async Task<IActionResult> GetDebts()
    {
        var UserId = Helpers.ReadUserIdFromToken(HttpContext, _db);
        if (UserId is null)
        {
            return BadRequest();
        }
        var user = _db.Users.FirstOrDefault(e => e.Id == UserId);
        if (user is null)
        {
            return BadRequest();
        }
        var debts = _db.Debts
            .Include(e => e.BorrowItem)
            .ThenInclude(e => e.Book)
            .ThenInclude(e => e.Category)
            .Include(e => e.BorrowItem)
            .ThenInclude(e => e.Borrow)
            .Where(e => e.ReaderId == UserId)
            .ToList();
        if (debts.Count == 0)
        {
            Console.WriteLine("debts.Count == 0");
            return NotFound();
        }
        var debtList = new List<DebtInstance>();
        foreach (var debt in debts)
        {
            if (debt.BorrowItem is null)
            {
                continue;
            }
            if (debt.BorrowItem.Borrow is null || debt.BorrowItem.Book is null)
            {
                continue;
            }
            debtList.Add(
                new DebtInstance()
                {
                    BorrowItemId = debt.BorrowItemId,
                    BorrowDate = debt.BorrowItem.Borrow.Date,
                    Book = debt.BorrowItem.Book,
                    BookCategory = debt.BorrowItem.Book.Category?.Category,
                    Quantity = debt.BorrowItem.Quantity,
                    ExpirationDate = debt.BorrowItem.ExpirationDate
                }
            );
        }
        if (debtList.Count == 0)
        {
            Console.WriteLine("debtList.Count == 0");
            return NotFound();
        }
        return Ok(debtList);
    }

    [HttpGet("borrows")]
    public async Task<IActionResult> GetBorrows()
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var borrows = _db.Borrows
            .Include(e => e.BorrowItems)
            .ThenInclude(e => e.Book)
            .ThenInclude(e => e.Category)
            .Where(e => e.ReaderId == user.Id)
            .OrderByDescending(e => e.Date)
            .ToList();
        if (borrows is null)
        {
            return NotFound();
        }
        var borrowInstances = new List<BorrowInstance>();
        foreach (var borrow in borrows)
        {
            if (borrow.BorrowItems is null)
            {
                continue;
            }
            var borrowInstance = new BorrowInstance()
            {
                BorrowId = borrow.Id,
                StaffId = borrow.StaffId,
                ReaderId = borrow.ReaderId,
                BorrowDate = borrow.Date,
                Cart = new(),
            };
            foreach (var borrowItem in borrow.BorrowItems)
            {
                borrowInstance.Cart.Add(
                    new BorrowInstance.BorrowPosition()
                    {
                        BorrowItemId = borrowItem.Id,
                        Book = borrowItem.Book,
                        BookCategory = borrowItem.Book?.Category?.Category,
                        Quantity = borrowItem.Quantity,
                        ExpirationDate = borrowItem.ExpirationDate
                    }
                );
            }
            borrowInstances.Add(borrowInstance);
        }
        if (borrowInstances.Count == 0)
        {
            return NotFound();
        }
        return Ok(borrowInstances);
    }

    [HttpGet("returns")]
    public async Task<IActionResult> GetReturns()
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var returns = _db.Returns
            .Include(e => e.ReturnItems)
            .ThenInclude(e => e.Book)
            .ThenInclude(e => e.Category)
            .Where(e => e.ReaderId == user.Id)
            .OrderByDescending(e => e.Date)
            .ToList();
        if (returns is null)
        {
            return NotFound();
        }
        var returnInstances = new List<ReturnInstance>();
        foreach (var returnal in returns)
        {
            if (returnal.ReturnItems is null)
            {
                continue;
            }
            var returnInstance = new ReturnInstance()
            {
                ReturnId = returnal.Id,
                StaffId = returnal.StaffId,
                ReaderId = returnal.ReaderId,
                ReturnDate = returnal.Date,
                Cart = new(),
            };
            foreach (var returnItem in returnal.ReturnItems)
            {
                returnInstance.Cart.Add(
                    new ReturnInstance.ReturnPosition()
                    {
                        ReturnItemId = returnItem.Id,
                        Book = returnItem.Book,
                        BookCategory = returnItem.Book?.Category?.Category,
                        Quantity = returnItem.Quantity,
                    }
                );
            }
            returnInstances.Add(returnInstance);
        }
        if (returnInstances.Count == 0)
        {
            return NotFound();
        }
        return Ok(returnInstances);
    }

    [HttpPost("wish/{Id}")]
    public async Task<ActionResult> PostWish(int Id)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var bookFound = _db.Books.FirstOrDefault(e => e.Id == Id);
        if (bookFound is null)
        {
            return NotFound();
        }
        var found = bookFound.Wishes.FirstOrDefault(e => e.UserId == user.Id);
        if (found is not null)
        {
            return Conflict();
        }
        var created = _db.Wishes.Add(
            new Wish()
            {
                Id = 0,
                UserId = user.Id,
                BookId = Id
            }
        );
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostWish), created.CurrentValues.ToObject());
    }

    [HttpGet("wish/{Id}")]
    public async Task<ActionResult> GetWish(int Id)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var found = _db.Wishes.FirstOrDefault(e => e.BookId == Id && e.UserId == user.Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpDelete("wish/{Id}")]
    public async Task<ActionResult> DeleteWish(int Id)
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var found = _db.Wishes.FirstOrDefault(e => e.BookId == Id && e.UserId == user.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.Wishes.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpGet("wishes")]
    public async Task<ActionResult> GetWishes()
    {
        var user = Helpers.ReadUserFromToken(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var wishes = _db.Wishes
            .Include(e => e.Book)
            .ThenInclude(e => e.Category)
            .Where(e => e.UserId == user.Id)
            .ToList();
        if (wishes is null)
        {
            return NotFound();
        }
        var wishInstances = new List<WishInstance>();
        foreach (var wish in wishes)
        {
            wishInstances.Add(
                new WishInstance()
                {
                    Id = wish.Id,
                    Book = wish.Book,
                    BookCategory = wish.Book?.Category?.Category,
                }
            );
        }
        return Ok(wishInstances);
    }

    [HttpPost("membership/transaction")]
    public async Task<ActionResult> PostMembershipTransaction([FromBody] decimal amount)
    {
        var user = await Helpers.UserMembershipAccess(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is not null)
        {
            membership.ExpirationDate = membership.ExpirationDate.AddDays((double)amount);
            if (await _db.SaveChangesAsync() == 0)
            {
                return BadRequest();
            }
            return Ok(membership);
        }
        var created = _db.MembershipTransactions.Add(
            new MembershipTransaction()
            {
                Id = 0,
                ReaderId = user.Id,
                Amount = amount,
                Date = DateTime.UtcNow,
            }
        );
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        _db.Memberships.Add(
            new Membership()
            {
                Id = 0,
                ReaderId = user.Id,
                StartDate = created.Entity.Date,
                ExpirationDate = created.Entity.Date.AddDays((double)amount),
            }
        );
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostMembershipTransaction), created.CurrentValues.ToObject());
    }

    [HttpGet("membership")]
    public async Task<ActionResult> GetMembership()
    {
        var user = await Helpers.UserMembershipAccess(HttpContext, _db);
        if (user is null)
        {
            return BadRequest();
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is null)
        {
            return NotFound();
        }
        return Ok(membership);
    }
}
