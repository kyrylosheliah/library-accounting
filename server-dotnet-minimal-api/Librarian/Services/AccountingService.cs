using LibAcct.App.PagedFilter;
using LibAcct.Authentication.Services;

namespace LibAcct.Librarian.Services;

public class AccountingService { 

    /// <summary>
    /// Returns null if the user was not found or if there are no active memberships
    /// </summary>
    /// <param name="userId"></param>
    /// <param name="database"></param>
    /// <param name="cancellationToken"></param>
    /// <returns></returns>
    public static async Task<User?> AccessUserThroughMembership(
        int? userId,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        if (userId is null)
        {
            return null;
        }
        var user = await database.Users
            .Include(e => e.Memberships)
            .FirstOrDefaultAsync(e => e.Id == userId, cancellationToken);
        if (user is null)
        {
            return null;
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is null)
        {
            return null;
        }
        if (DateTime.UtcNow >= membership.ExpirationDate)
        {
            database.Memberships.Remove(membership);
            await database.SaveChangesAsync(cancellationToken);
        }
        return user;
    }

    public static async Task<User?> AccessUserThroughMembership(
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var userId = JwtService.ExtractUserIdFromToken(context);
        return await AccessUserThroughMembership(userId, database, cancellationToken);
    }

    public static async Task AccountShelf(
        AppDatabase database,
        int BookId,
        CancellationToken cancellationToken
    ) {
        var bookShelves = await database.Shelves
            .Where(e => e.BookId == BookId)
            .ToListAsync(cancellationToken);
        foreach (var shelf in bookShelves)
        {
            database.Shelves.Remove(shelf);
        }
        var booksSuppliedCount = await database.SupplyItems
            .Where(e => e.BookId == BookId)
            .Select(e => e.Quantity)
            .SumAsync(cancellationToken);
        var booksIndebted = await database.Debts
            .Include(e => e.BorrowItem)
            .Where(e => e.BorrowItem.BookId == BookId)
            .CountAsync(cancellationToken);
        var quantity = booksSuppliedCount - booksIndebted;
        if (quantity == 0)
        {
            return;
        }
        database.Shelves.Add(
            new Shelf()
            {
                Id = 0,
                BookId = BookId,
                Quantity = quantity,
            }
        );
    }

    public static async Task AccountBookShelves(
        AppDatabase database,
        List<int> BookIds,
        CancellationToken cancellationToken
    ) {
        if (BookIds.Count == 0)
        {
            return;
        }
        foreach (var BookId in BookIds)
        {
            await AccountShelf(database, BookId, cancellationToken);
        }
        await database.SaveChangesAsync(cancellationToken);
    }

    public static async Task AccountAllShelves(
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        await database.Database.ExecuteSqlRawAsync("TRUNCATE TABLE Shelf", cancellationToken);
        var booksQueryable = database.Books.AsQueryable();
        var pageSize = 100;
        var pageNo = 1;
        while (true)
        {
            var filter = await booksQueryable.ToPagedFilteredListAsync(
                new Book(),
                new PagedEntityFilterRequest()
                {
                    Ascending = true,
                    OrderByColumn = "Id",
                    PageSize = pageSize,
                    PageNo = pageNo
                },
                cancellationToken
            );
            var pageCount = filter.Item1;
            if (pageNo >= pageCount)
            {
                break;
            }
            var bookIds = filter.Item2.Select(e => e.Id).ToList();
            if (bookIds != null)
            {
                await AccountBookShelves(database, bookIds, cancellationToken);
            }
        }
    }

    public static async Task<string> AccountBorrowDebt(
        AppDatabase database,
        int BorrowId,
        CancellationToken cancellationToken
    ) {
        var borrowFound = await database.Borrows
            .Include(e => e.BorrowItems)
            .ThenInclude(e => e.Debts)
            .FirstOrDefaultAsync(e => e.Id == BorrowId, cancellationToken);
        if (borrowFound is null)
        {
            return "Borrow not found";
        }
        var BookIds = new List<int>();
        foreach (var borrowItem in borrowFound.BorrowItems)
        {
            foreach (var debt in borrowItem.Debts)
            {
                database.Debts.Remove(debt);
            }
            var shelfQuantity = await database.Shelves
                .Where(e => e.BookId == borrowItem.BookId)
                .Select(e => e.Quantity)
                .SumAsync(cancellationToken);
            if (borrowItem.Quantity > shelfQuantity)
            {
                return $"Borrow item {borrowItem.Id} quantity > than on shelves";
            }
            BookIds.Add(borrowItem.BookId);
            var counter = borrowItem.Quantity;
            while (counter > 0)
            {
                database.Debts.Add(
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
        if (await database.SaveChangesAsync(cancellationToken) == 0)
        {
            return "No changes";
        }
        await AccountBookShelves(database, BookIds, cancellationToken);
        return "";
    }

    public static async Task<string> AccountDebtReturn(
        AppDatabase database,
        int ReturnId,
        CancellationToken cancellationToken
    ) {
        var returnFound = await database.Returns
            .Include(e => e.ReturnItems)
            .FirstOrDefaultAsync(e => e.Id == ReturnId, cancellationToken);
        if (returnFound is null)
        {
            return "Return not found";
        }
        var BookIds = new List<int>();
        foreach (var returnItem in returnFound.ReturnItems)
        {
            var userDebts = await database.Debts
                .Include(e => e.BorrowItem)
                .Where(e => e.ReaderId == returnFound.ReaderId)
                .ToListAsync(cancellationToken);
            var debts = userDebts.Where(e => e.BorrowItem?.BookId == returnItem.BookId).ToList();
            if (returnItem.Quantity > debts.Count)
            {
                return $"Return item {returnItem.Id} quantity > than in debt";
            }
            BookIds.Add(returnItem.BookId);
            var counter = returnItem.Quantity;
            while (counter > 0)
            {
                database.Debts.Remove(debts[0]);
                --counter;
            }
        }
        if (await database.SaveChangesAsync(cancellationToken) == 0)
        {
            return "No changes";
        }
        await AccountBookShelves(database, BookIds, cancellationToken);
        return "";
    }

    public static async Task<string> AccountShelfSupply(
        AppDatabase database,
        int SupplyId,
        CancellationToken cancellationToken)
    {
        var supplyFound = await database.Supplies
            .Include(e => e.SupplyItems)
            .FirstOrDefaultAsync(e => e.Id == SupplyId, cancellationToken);
        if (supplyFound is null)
        {
            return "Supply not found";
        }
        var BookIds = new List<int>();
        foreach (var supplyItem in supplyFound.SupplyItems)
        {
            BookIds.Add(supplyItem.BookId);
        }
        await AccountBookShelves(database, BookIds, cancellationToken);
        return "";
    }

}