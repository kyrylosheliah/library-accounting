using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class GetBorrows : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/borrows", Handle)
        .WithSummary("Get the current user's borrows");

    public record BorrowPosition(
        int BorrowItemId,
        Book? Book,
        string? BookCategory,
        int Quantity,
        DateTime ExpirationDate
    );

    public record BorrowInstance(
        int BorrowId,
        int StaffId,
        int ReaderId,
        DateTime BorrowDate,
        List<BorrowPosition> Cart
    );

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        var borrows = await database.Borrows
            .Include(x => x.BorrowItems)
            .ThenInclude(x => x.Book)
            .ThenInclude(x => x.Category)
            .Where(x => x.ReaderId == user.Id)
            .OrderByDescending(x => x.Date)
            .ToListAsync(cancellationToken);
        if (borrows.Count == 0) {
            return TypedResults.NotFound();
        }
        var borrowList = new List<BorrowInstance>();
        foreach (var borrow in borrows) {
            if (borrow.BorrowItems is null) {
                continue;
            }
            var borrowInstance = new BorrowInstance(
                borrow.Id,
                borrow.StaffId,
                borrow.ReaderId,
                borrow.Date,
                []
            );
            foreach (var borrowItem in borrow.BorrowItems) {
                borrowInstance.Cart.Add(
                    new BorrowPosition(
                        borrowItem.Id,
                        borrowItem.Book,
                        borrowItem.Book?.Category?.Category,
                        borrowItem.Quantity,
                        borrowItem.ExpirationDate
                    )
                );
            }
        }
        if (borrowList.Count == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(borrowList);
    }
}