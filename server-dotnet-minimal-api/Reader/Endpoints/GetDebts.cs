using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class GetDebts : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/debts", Handle)
        .WithSummary("Get the current user's debts");

    private record DebtInstance(
        int BorrowItemId,
        DateTime BorrowDate,
        Book? Book,
        string? BookCategory,
        int Quantity,
        DateTime ExpirationDate
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
        var debts = await database.Debts
            .Include(x => x.BorrowItem)
            .ThenInclude(x => x.Book)
            .ThenInclude(x => x.Category)
            .Include(x => x.BorrowItem)
            .ThenInclude(x => x.Borrow)
            .Where(x => x.ReaderId == user.Id)
            .ToListAsync(cancellationToken);
        if (debts.Count == 0) {
            return TypedResults.NotFound();
        }
        var debtList = new List<DebtInstance>();
        foreach (var debt in debts) {
            if (debt.BorrowItem is null) {
                continue;
            }
            if (debt.BorrowItem.Borrow is null || debt.BorrowItem.Book is null) {
                continue;
            }
            debtList.Add(
                new DebtInstance(
                    debt.BorrowItemId,
                    debt.BorrowItem.Borrow.Date,
                    debt.BorrowItem.Book,
                    debt.BorrowItem.Book.Category?.Category,
                    debt.BorrowItem.Quantity,
                    debt.BorrowItem.ExpirationDate
                )
            );
        }
        if (debtList.Count == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(debtList);
    }
}