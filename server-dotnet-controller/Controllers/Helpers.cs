using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;
using System.Data;
using Microsoft.AspNetCore.StaticFiles;
using LibAcct.Models;
using LibAcct.Data;

namespace LibAcct.Controllers;

public static class Helpers
{
    public static int? ReadUserIdFromToken(HttpContext HttpContext, DataContext _db)
    {
        var uidString = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (uidString is null)
        {
            return null;
        }
        int uid;
        if (!int.TryParse(uidString, out uid))
        {
            return null;
        }
        return uid;
    }

    public static User? ReadUserFromToken(HttpContext HttpContext, DataContext _db)
    {
        var uidString = HttpContext.User.Claims.FirstOrDefault(c => c.Type == "uid")?.Value;
        if (uidString is null)
        {
            return null;
        }
        int uid;
        if (!int.TryParse(uidString, out uid))
        {
            return null;
        }
        return _db.Users.FirstOrDefault(u => u.Id == uid);
    }

    public static void WriteUserAvatar(int userId, IFormFile file)
    {
        DeleteUserAvatar(userId);
        var split = file.FileName.Split('.');
        var extension = split[split.Length - 1];
        var filename = $"{userId}_avatar.{extension}";
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars", filename);
        if (file.Length > 0)
        {
            using (Stream fileStream = new FileStream(filepath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }
        }
    }

    public static async Task<(byte[] bytes, string contenttype)?> ReadUserAvatar(int userId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars");
        System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(filepath);
        IEnumerable<System.IO.FileInfo> fileList = dir.GetFiles(
            $"{userId}_avatar.*",
            System.IO.SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return null;
        }
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(fileinfo, out var contenttype))
        {
            contenttype = "application/octet-stream";
        }
        var bytes = await System.IO.File.ReadAllBytesAsync(fileinfo);
        return (bytes, contenttype);
    }

    public static bool DeleteUserAvatar(int userId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars");
        System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(filepath);
        IEnumerable<System.IO.FileInfo> fileList = dir.GetFiles(
            $"{userId}_avatar.*",
            System.IO.SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return false;
        }
        System.IO.File.Delete(fileinfo);
        return true;
    }

    public static async Task<(byte[] bytes, string contenttype)?> ReadBookCover(int bookId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\api\\book");
        System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(filepath);
        IEnumerable<System.IO.FileInfo> fileList = dir.GetFiles(
            $"{bookId}_cover.*",
            System.IO.SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return null;
        }
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(fileinfo, out var contenttype))
        {
            contenttype = "application/octet-stream";
        }
        var bytes = await System.IO.File.ReadAllBytesAsync(fileinfo);
        return (bytes, contenttype);
    }

    public static async void WriteBookCover(int bookId, IFormFile file)
    {
        var split = file.FileName.Split('.');
        var extension = split[split.Length - 1];
        var filename = $"{bookId}_cover.{extension}";
        var filepath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot\\api\\book",
            filename
        );
        using (var stream = new FileStream(filepath, FileMode.Create))
        {
            await file.CopyToAsync(stream);
        }
    }

    public static bool DeleteBookCover(int bookId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\api\\book");
        System.IO.DirectoryInfo dir = new System.IO.DirectoryInfo(filepath);
        IEnumerable<System.IO.FileInfo> fileList = dir.GetFiles(
            $"{bookId}_cover.*",
            System.IO.SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return false;
        }
        System.IO.File.Delete(fileinfo);
        return true;
    }

    public static ValueTuple<int, IQueryable<T>> GetEntitiesFiltered<T>(
        IQueryable<T> entities,
        T entityInstance,
        EntityFilterRequest request
    )
    {
        if (request.criterias is not null)
        {
            foreach (var criteria in request.criterias)
            {
                if (criteria.value == "")
                {
                    continue;
                }
                var property = entityInstance.GetType().GetProperty(criteria.column);
                if (property is null)
                {
                    return new ValueTuple<int, IQueryable<T>>(
                        0,
                        Enumerable.Empty<T>().AsQueryable()
                    );
                }
                if (criteria.column.Contains("Id"))
                {
                    entities = entities.Where(
                        $"{criteria.column}.ToString()==(\"{criteria.value.ToLower()}\")"
                    );
                }
                else
                {
                    var makeString = property.PropertyType == typeof(string) ? "" : ".ToString()";
                    entities = entities.Where(
                        $"{criteria.column}{makeString}.ToLower().Contains(\"{criteria.value.ToLower()}\")"
                    );
                }
            }
        }
        var searchCount = entities.Count();
        if (searchCount == 0)
        {
            return new ValueTuple<int, IQueryable<T>>(0, Enumerable.Empty<T>().AsQueryable());
        }
        var pageModulo = searchCount % request.pageSize;
        var pageCount = (searchCount - pageModulo) / request.pageSize + (pageModulo == 0 ? 0 : 1);
        var toSkip = (request.pageNo - 1) * request.pageSize;
        var toTake = request.pageSize;
        if (request.ascending)
        {
            entities = entities.OrderBy(e => EF.Property<object>(e, request.orderByColumn));
        }
        else
        {
            entities = entities.OrderByDescending(
                e => EF.Property<object>(e, request.orderByColumn)
            );
        }
        var result = entities.Skip(toSkip).Take(toTake);
        return new ValueTuple<int, IQueryable<T>>(pageCount, result);
    }

    public static async Task<User?> UserMembershipAccessById(
        HttpContext HttpContext,
        DataContext _db,
        int? userId
    )
    {
        if (userId is null)
        {
            return null;
        }
        var user = _db.Users.Include(e => e.Memberships).FirstOrDefault(e => e.Id == userId);
        if (user is null)
        {
            return null;
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is null)
        {
            return user;
        }
        if (DateTime.UtcNow >= membership.ExpirationDate)
        {
            _db.Memberships.Remove(membership);
            await _db.SaveChangesAsync();
        }
        return user;
    }

    public static async Task<User?> UserMembershipAccess(HttpContext HttpContext, DataContext _db)
    {
        var userId = Helpers.ReadUserIdFromToken(HttpContext, _db);
        return await UserMembershipAccessById(HttpContext, _db, userId);
    }

    public static async Task AccountBookShelf(DataContext _db, int BookId)
    {
        var bookShelves = _db.Shelves.Where(e => e.BookId == BookId).ToList();
        foreach (var shelf in bookShelves)
        {
            _db.Shelves.Remove(shelf);
        }
        var booksSuppliedCount = await _db.SupplyItems
            .Where(e => e.BookId == BookId)
            .Select(e => e.Quantity)
            .SumAsync();
        var booksIndebted = await _db.Debts
            .Include(e => e.BorrowItem)
            .Where(e => e.BorrowItem.BookId == BookId)
            .CountAsync();
        var quantity = booksSuppliedCount - booksIndebted;
        if (quantity == 0)
        {
            return;
        }
        _db.Shelves.Add(
            new Shelf()
            {
                Id = 0,
                BookId = BookId,
                Quantity = quantity,
            }
        );
    }

    public static async Task AccountBookShelves(DataContext _db, List<int> BookIds)
    {
        if (BookIds.Count == 0)
        {
            return;
        }
        foreach (var BookId in BookIds)
        {
            await AccountBookShelf(_db, BookId);
        }
        await _db.SaveChangesAsync();
    }

    public static async Task AccountAllShelves(DataContext _db)
    {
        await _db.Database.ExecuteSqlRawAsync("TRUNCATE TABLE Shelf");
        var booksQueryable = _db.Books.AsQueryable();
        var pageSize = 100;
        var pageNo = 1;
        while (true)
        {
            var filter = GetEntitiesFiltered<Book>(
                booksQueryable,
                new Book(),
                new EntityFilterRequest()
                {
                    ascending = true,
                    criterias = null,
                    orderByColumn = "Id",
                    pageSize = pageSize,
                    pageNo = pageNo
                }
            );
            var pageCount = filter.Item1;
            if (pageNo >= pageCount)
            {
                break;
            }
            var bookIds = filter.Item2.Select(e => e.Id).ToList();
            if (bookIds != null)
            {
                await AccountBookShelves(_db, bookIds);
            }
        }
    }

    public static async Task<string> AccountBorrowDebt(DataContext _db, int BorrowId)
    {
        var borrowFound = _db.Borrows
            .Include(e => e.BorrowItems)
            .ThenInclude(e => e.Debts)
            .FirstOrDefault(e => e.Id == BorrowId);
        if (borrowFound is null)
        {
            return "Borrow not found";
        }
        var BookIds = new List<int>();
        foreach (var borrowItem in borrowFound.BorrowItems)
        {
            foreach (var debt in borrowItem.Debts)
            {
                _db.Debts.Remove(debt);
            }
            var shelfQuantity = await _db.Shelves
                .Where(e => e.BookId == borrowItem.BookId)
                .Select(e => e.Quantity)
                .SumAsync();
            if (borrowItem.Quantity > shelfQuantity)
            {
                return $"Borrow item {borrowItem.Id} quantity > than on shelves";
            }
            BookIds.Add(borrowItem.BookId);
            var counter = borrowItem.Quantity;
            while (counter > 0)
            {
                _db.Debts.Add(
                    new Debt()
                    {
                        Id = 0,
                        ReaderId = borrowFound.ReaderId,
                        BorrowItemId = borrowItem.Id,
                    }
                );
                --counter;
            }
        }
        if (await _db.SaveChangesAsync() == 0)
        {
            return "No changes";
        }
        await AccountBookShelves(_db, BookIds);
        return "";
    }

    public static async Task<string> AccountDebtReturn(DataContext _db, int ReturnId)
    {
        var returnFound = _db.Returns
            .Include(e => e.ReturnItems)
            .FirstOrDefault(e => e.Id == ReturnId);
        if (returnFound is null)
        {
            return "Return not found";
        }
        var BookIds = new List<int>();
        foreach (var returnItem in returnFound.ReturnItems)
        {
            var userDebts = _db.Debts
                .Include(e => e.BorrowItem)
                .Where(e => e.ReaderId == returnFound.ReaderId)
                .ToList();
            var debts = userDebts.Where(e => e.BorrowItem?.BookId == returnItem.BookId).ToList();
            if (returnItem.Quantity > debts.Count)
            {
                return $"Return item {returnItem.Id} quantity > than in debt";
            }
            BookIds.Add(returnItem.BookId);
            var counter = returnItem.Quantity;
            while (counter > 0)
            {
                _db.Debts.Remove(debts[0]);
                --counter;
            }
        }
        if (await _db.SaveChangesAsync() == 0)
        {
            return "No changes";
        }
        await AccountBookShelves(_db, BookIds);
        return "";
    }

    public static async Task<string> AccountShelfSupply(DataContext _db, int SupplyId)
    {
        var supplyFound = _db.Supplies
            .Include(e => e.SupplyItems)
            .FirstOrDefault(e => e.Id == SupplyId);
        if (supplyFound is null)
        {
            return "Supply not found";
        }
        var BookIds = new List<int>();
        foreach (var supplyItem in supplyFound.SupplyItems)
        {
            BookIds.Add(supplyItem.BookId);
        }
        await AccountBookShelves(_db, BookIds);
        return "";
    }
}
