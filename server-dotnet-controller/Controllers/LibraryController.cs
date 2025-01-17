using LibAcct.Data;
using LibAcct.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace LibAcct.Controllers;

[ApiController]
[Route("api/library")]
public class LibraryController : ControllerBase
{
    private readonly DataContext _db;

    public LibraryController(DataContext dbContext)
    {
        _db = dbContext;
    }

    [HttpGet("categories")]
    public async Task<ActionResult> SearchCategories()
    {
        return Ok(_db.BookCategories.ToList());
    }

    [HttpPost("search")]
    public async Task<ActionResult> Search([FromBody] EntityFilterRequest request)
    {
        IQueryable<Book> books = _db.Books.AsQueryable();
        var (pageCount, queryable) = Helpers.GetEntitiesFiltered(books, new Models.Book(), request);
        var result = queryable.ToList();
        if (pageCount == 0)
        {
            return NotFound();
        }
        return Ok(new { pageCount = pageCount, result = result });
    }

    [HttpGet("book/{Id}")]
    public async Task<ActionResult> GetBook(int Id)
    {
        var found = _db.Books
            .Include(e => e.Shelves)
            .Include(e => e.Wishes)
            .FirstOrDefault(b => b.Id == Id);
        if (found is null)
        {
            return NotFound();
        }
        var shelves = found.Shelves.Select(e => e.Quantity).Sum();
        var wishes = found.Wishes.Count();
        return Ok(
            new
            {
                quantity = shelves,
                wishes,
                result = found,
            }
        );
    }

    [HttpGet("category/{categoryId}")]
    public async Task<ActionResult> GetCategory(int CategoryId)
    {
        var found = _db.BookCategories.FirstOrDefault(bc => bc.Id == CategoryId);
        if (found is null)
        {
            return NotFound();
        }
        return Ok(found);
    }
}
