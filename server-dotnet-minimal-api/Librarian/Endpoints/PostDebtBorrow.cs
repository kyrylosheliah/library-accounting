using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class PostDebtBorrow : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/debt/borrow/{Id}", Handle)
        .WithSummary("Account debt by borrow ID");

    private static async Task<IResult> Handle(
        int Id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        string message = await AccountingService.AccountShelfSupply(database, Id, cancellationToken);
        if (message != "") {
            return TypedResults.BadRequest(message);
        }
        return TypedResults.Ok();
    }
}