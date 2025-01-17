using LibAcct.Data;
using LibAcct.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibAcct.Controllers;

[ApiController]
[Authorize]
[RequiresClaim(ClaimValues.librarian, "true")]
[Route("api/librarian")]
public class LibrarianController : ControllerBase
{
    private readonly DataContext _db;

    public LibrarianController(DataContext dbContext)
    {
        _db = dbContext;
    }

    [HttpGet("book/cover/{Id}")]
    public async Task<ActionResult> GetCover(int Id)
    {
        var result = await Helpers.ReadBookCover(Id);
        if (result is null)
        {
            return NotFound();
        }
        var cover = File(result.Value.Item1, result.Value.Item2);
        return Ok(cover);
    }

    [HttpPost("book/cover/{Id}")]
    public async Task<ActionResult> PostCover([FromForm]int Id, IFormFile file)
    {
        var found = _db.Books.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        try
        {
            Helpers.WriteBookCover(Id, file);
        }
        catch (Exception e)
        {
            return BadRequest(e.Message);
        }
        return Ok();
    }

    [HttpDelete("book/cover/{Id}")]
    public async Task<ActionResult> DeleteCover(int Id)
    {
        var found = _db.Books.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var deleted = Helpers.DeleteBookCover(Id);
        if (deleted)
        {
            return NoContent();
        }
        return NotFound();
    }

    [HttpGet("book/count")]
    public async Task<ActionResult> GetBookCount()
    {
        return Ok(_db.Books.Count());
    }

    [HttpPost("book")]
    public async Task<ActionResult> PostBook([FromBody] Book request)
    {
        var found = _db.Books.FirstOrDefault(
            e => e.Isbn == request.Isbn || e.Title == request.Title
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.Books.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok();
    }

    [HttpGet("book/{Id}")]
    public async Task<ActionResult> GetBook(int Id)
    {
        var found = _db.Books.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("book")]
    public async Task<ActionResult> PutBook([FromBody] Book request)
    {
        var found = _db.Books.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        var categoryFound = _db.BookCategories.FirstOrDefault(e => e.Id == request.CategoryId);
        if (categoryFound is null)
        {
            return BadRequest();
        }
        _db.Books.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("book/{Id}")]
    public async Task<ActionResult> DeleteBook(int Id)
    {
        var found = _db.Books.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.Books.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        await DeleteCover(Id);
        return NoContent();
    }

    [HttpPost("books")]
    public async Task<ActionResult> GetBooks([FromBody] EntityFilterRequest request)
    {
        IQueryable<Book> entities = _db.Books.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Book(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpGet("category/count")]
    public async Task<ActionResult> GetCategoryCount()
    {
        return Ok(_db.BookCategories.Count());
    }

    [HttpPost("category")]
    public async Task<ActionResult> PostCategory([FromBody] BookCategory request)
    {
        var found = _db.BookCategories.FirstOrDefault(e => e.Category == request.Category);
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.BookCategories.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostCategory), created.CurrentValues.ToObject());
    }

    [HttpGet("category/{Id}")]
    public async Task<ActionResult> GetCategory(int Id)
    {
        var found = _db.BookCategories.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("category")]
    public async Task<ActionResult> PutCategory([FromBody] BookCategory request)
    {
        var found = _db.BookCategories.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        found.Category = request.Category;
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("category/{Id}")]
    public async Task<ActionResult> DeleteCategory(int Id)
    {
        var found = _db.BookCategories.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.BookCategories.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("categories")]
    public async Task<ActionResult> GetCategories([FromBody] EntityFilterRequest request)
    {
        IQueryable<BookCategory> entities = _db.BookCategories.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.BookCategory(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpGet("supplier/count")]
    public async Task<ActionResult> GetSupplierCount()
    {
        return Ok(_db.Suppliers.Count());
    }

    [HttpPost("supplier")]
    public async Task<ActionResult> PostSupplier([FromBody] Supplier request)
    {
        var found = _db.Suppliers.FirstOrDefault(
            e => e.Name == request.Name || e.Phone == request.Phone
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.Suppliers.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostSupplier), created.CurrentValues.ToObject());
    }

    [HttpGet("supplier/{Id}")]
    public async Task<ActionResult> GetSupplier(int Id)
    {
        var found = _db.Suppliers.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("supplier")]
    public async Task<ActionResult> PutSupplier([FromBody] Supplier request)
    {
        var found = _db.Suppliers.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.Suppliers.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("supplier/{Id}")]
    public async Task<ActionResult> DeleteSupplier(int Id)
    {
        var found = _db.Suppliers.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.Suppliers.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("suppliers")]
    public async Task<ActionResult> GetSuppliers([FromBody] EntityFilterRequest request)
    {
        IQueryable<Supplier> entities = _db.Suppliers.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Supplier(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("supply")]
    public async Task<ActionResult> PostSupply([FromBody] Supply request)
    {
        request.Id = 0;
        request.Date = DateTime.UtcNow;
        var created = _db.Supplies.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostSupply), created.CurrentValues.ToObject());
    }

    [HttpGet("supply/{Id}")]
    public async Task<ActionResult> GetSupply(int Id)
    {
        var found = _db.Supplies.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("supply")]
    public async Task<ActionResult> PutSupply([FromBody] Supply request)
    {
        var found = _db.Supplies.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        request.Date = found.Date;
        _db.Supplies.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("supply/{Id}")]
    public async Task<ActionResult> DeleteSupply(int Id)
    {
        var found = _db.Supplies.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.Supplies.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("supplies")]
    public async Task<ActionResult> GetSupplies([FromBody] EntityFilterRequest request)
    {
        IQueryable<Supply> entities = _db.Supplies.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Supply(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("supplyitem")]
    public async Task<ActionResult> PostSupplyItem([FromBody] SupplyItem request)
    {
        var found = _db.SupplyItems.FirstOrDefault(
            e => e.BookId == request.BookId && e.SupplyId == request.SupplyId
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.SupplyItems.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostSupplyItem), created.CurrentValues.ToObject());
    }

    [HttpGet("supplyitem/{Id}")]
    public async Task<ActionResult> GetSupplyItem(int Id)
    {
        var found = _db.SupplyItems.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("supplyitem")]
    public async Task<ActionResult> PutSupplyItem([FromBody] SupplyItem request)
    {
        var found = _db.SupplyItems.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.SupplyItems.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("supplyitem/{Id}")]
    public async Task<ActionResult> DeleteSupplyItem(int Id)
    {
        var found = _db.SupplyItems.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.SupplyItems.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("supplyitems")]
    public async Task<ActionResult> GetSupplyItems([FromBody] EntityFilterRequest request)
    {
        IQueryable<SupplyItem> entities = _db.SupplyItems.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.SupplyItem(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("borrow")]
    public async Task<ActionResult> PostBorrow([FromBody] Borrow request)
    {
        var staff = Helpers.ReadUserFromToken(HttpContext, _db);
        if (staff is null)
        {
            return Unauthorized();
        }
        var user = await Helpers.UserMembershipAccessById(HttpContext, _db, request.ReaderId);
        if (user is null)
        {
            return BadRequest();
        }
        if (user.Memberships.FirstOrDefault() is null)
        {
            return UnprocessableEntity();
        }
        request.Id = 0;
        request.StaffId = staff.Id;
        request.Date = DateTime.UtcNow;
        var created = _db.Borrows.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostBorrow), created.CurrentValues.ToObject());
    }

    [HttpGet("borrow/{Id}")]
    public async Task<ActionResult> GetBorrow(int Id)
    {
        var found = _db.Borrows.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("borrow")]
    public async Task<ActionResult> PutBorrow([FromBody] Borrow request)
    {
        var found = _db.Borrows.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        request.StaffId = found.StaffId;
        request.Date = found.Date;
        _db.Borrows.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("borrow/{Id}")]
    public async Task<ActionResult> DeleteBorrow(int Id)
    {
        var found = _db.Borrows.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.Borrows.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("borrows")]
    public async Task<ActionResult> GetBorrows([FromBody] EntityFilterRequest request)
    {
        IQueryable<Borrow> entities = _db.Borrows.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Borrow(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("borrowitem")]
    public async Task<ActionResult> PostBorrowItem([FromBody] BorrowItem request)
    {
        var found = _db.BorrowItems.FirstOrDefault(
            e => e.BookId == request.BookId && e.BorrowId == request.BorrowId
        );
        if (found is not null)
        {
            return Conflict();
        }
        var borrowFound = _db.Borrows.FirstOrDefault(e => e.Id == request.BorrowId);
        if (borrowFound is null)
        {
            return NotFound();
        }
        var bookFound = _db.Books.FirstOrDefault(e => e.Id == request.BookId);
        if (bookFound is null)
        {
            return NotFound();
        }
        request.Id = 0;
        int daysToAdd = 14;
        if (bookFound.BookingPolicy != null)
        {
            if (bookFound.BookingPolicy > 0)
            {
                daysToAdd = (int)bookFound.BookingPolicy;
            }
        }
        request.ExpirationDate = borrowFound.Date.AddDays(daysToAdd);
        var created = _db.BorrowItems.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        var debtCreated = _db.Debts.Add(
            new Debt()
            {
                Id = 0,
                ReaderId = borrowFound.ReaderId,
                BorrowItemId = created.Entity.Id
            }
        );
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostBorrowItem), created.CurrentValues.ToObject());
    }

    [HttpGet("borrowitem/{Id}")]
    public async Task<ActionResult> GetBorrowItem(int Id)
    {
        var found = _db.BorrowItems.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("borrowitem")]
    public async Task<ActionResult> PutBorrowItem([FromBody] BorrowItem request)
    {
        var found = _db.BorrowItems.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.BorrowItems.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("borrowitem/{Id}")]
    public async Task<ActionResult> DeleteBorrowItem(int Id)
    {
        var found = _db.BorrowItems.Include(e => e.Debts).FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var debtFound = found.Debts.FirstOrDefault();
        if (debtFound is not null)
        {
            _db.Debts.Remove(debtFound);
        }
        var response = _db.BorrowItems.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("borrowitems")]
    public async Task<ActionResult> GetBorrowItems([FromBody] EntityFilterRequest request)
    {
        IQueryable<BorrowItem> entities = _db.BorrowItems.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.BorrowItem(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("return")]
    public async Task<ActionResult> PostReturn([FromBody] Return request)
    {
        var staff = Helpers.ReadUserFromToken(HttpContext, _db);
        if (staff is null)
        {
            return Unauthorized();
        }
        var user = _db.Users
            .Include(e => e.Memberships)
            .FirstOrDefault(e => e.Id == request.ReaderId);
        if (user is null)
        {
            return BadRequest();
        }
        request.Id = 0;
        request.StaffId = staff.Id;
        request.Date = DateTime.UtcNow;
        var created = _db.Returns.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostReturn), created.CurrentValues.ToObject());
    }

    [HttpGet("return/{Id}")]
    public async Task<ActionResult> GetReturn(int Id)
    {
        var found = _db.Returns.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("return")]
    public async Task<ActionResult> PutReturn([FromBody] Return request)
    {
        var found = _db.Returns.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        request.StaffId = found.StaffId;
        request.Date = found.Date;
        _db.Returns.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("return/{Id}")]
    public async Task<ActionResult> DeleteReturn(int Id)
    {
        var found = _db.Returns.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.Returns.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("returns")]
    public async Task<ActionResult> GetReturns([FromBody] EntityFilterRequest request)
    {
        IQueryable<Return> entities = _db.Returns.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.Return(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("returnitem")]
    public async Task<ActionResult> PostReturnItem([FromBody] ReturnItem request)
    {
        var found = _db.ReturnItems.FirstOrDefault(
            e => e.BookId == request.BookId && e.ReturnId == request.ReturnId
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        var created = _db.ReturnItems.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostReturnItem), created.CurrentValues.ToObject());
    }

    [HttpGet("returnitem/{Id}")]
    public async Task<ActionResult> GetReturnItem(int Id)
    {
        var found = _db.ReturnItems.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("returnitem")]
    public async Task<ActionResult> PutReturnItem([FromBody] ReturnItem request)
    {
        var found = _db.ReturnItems.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.ReturnItems.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("returnitem/{Id}")]
    public async Task<ActionResult> DeleteReturnItem(int Id)
    {
        var found = _db.ReturnItems.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var response = _db.ReturnItems.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("returnitems")]
    public async Task<ActionResult> GetReturnItems([FromBody] EntityFilterRequest request)
    {
        IQueryable<ReturnItem> entities = _db.ReturnItems.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            entities,
            new Models.ReturnItem(),
            request
        );
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpPost("debt/borrow/{BorrowId}")]
    public async Task<ActionResult> PostBorrowDebt(int BorrowId)
    {
        var message = await Helpers.AccountBorrowDebt(_db, BorrowId);
        if (message != "")
        {
            return BadRequest(message);
        }
        return Ok();
    }

    [HttpDelete("debt/return/{ReturnId}")]
    public async Task<ActionResult> PostDebt(int ReturnId)
    {
        var message = await Helpers.AccountDebtReturn(_db, ReturnId);
        if (message != "")
        {
            return BadRequest(message);
        }
        return Ok();
    }

    [HttpPost("shelf/supply/{SupplyId}")]
    public async Task<ActionResult> PostBookShelf(int SupplyId)
    {
        string message = await Helpers.AccountShelfSupply(_db, SupplyId);
        if (message != "")
        {
            return BadRequest(message);
        }
        return Ok();
    }

    [HttpPost("appointment")]
    public async Task<ActionResult> PostAppointment([FromBody] Appointment request)
    {
        var found = _db.Appointments.FirstOrDefault(
            e => e.Date == request.Date && e.StaffId == request.StaffId
        );
        if (found is not null)
        {
            return Conflict();
        }
        request.Id = 0;
        request.Created = DateTime.UtcNow;
        request.Modified = DateTime.UtcNow;
        var created = _db.Appointments.Add(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Created(nameof(PostAppointment), created.CurrentValues.ToObject());
    }

    [HttpGet("appointment/{Id}")]
    public async Task<ActionResult> GetAppointment(int Id)
    {
        var found = _db.Appointments.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }

    [HttpPut("appointment")]
    public async Task<ActionResult> PutAppointment([FromBody] Appointment request)
    {
        var found = _db.Appointments.FirstOrDefault(e => e.Id == request.Id);
        if (found is null)
        {
            return NotFound();
        }
        request.Created = found.Created;
        request.Modified = DateTime.UtcNow;
        _db.Appointments.Entry(found).CurrentValues.SetValues(request);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return Ok(found);
    }

    [HttpDelete("appointment/{Id}")]
    public async Task<ActionResult> DeleteAppointment(int Id)
    {
        var found = _db.Appointments.FirstOrDefault(e => e.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        _db.Appointments.Remove(found);
        if (await _db.SaveChangesAsync() == 0)
        {
            return BadRequest();
        }
        return NoContent();
    }

    [HttpPost("appointments")]
    public async Task<ActionResult> GetAppointments([FromBody] EntityFilterRequest request)
    {
        IQueryable<Appointment> appointments = _db.Appointments.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(
            appointments,
            new Models.Appointment(),
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
