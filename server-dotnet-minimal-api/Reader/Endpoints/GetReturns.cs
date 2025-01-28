using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class GetReturns : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/returns", Handle)
        .WithSummary("Get the current user's returns");

    public record ReturnPosition(
        int ReturnItemId,
        Book? Book,
        string? BookCategory,
        int Quantity
    );

    public record ReturnInstance(
        int ReturnId,
        int ReaderId,
        int StaffId,
        DateTime ReturnDate,
        List<ReturnPosition> Cart
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
        var returns = await database.Returns
            .Include(x => x.ReturnItems)
            .ThenInclude(x => x.Book)
            .ThenInclude(x => x.Category)
            .Where(x => x.ReaderId == user.Id)
            .OrderByDescending(x => x.Date)
            .ToListAsync(cancellationToken);
        if (returns.Count == 0) {
            return TypedResults.NotFound();
        }
        var returnList = new List<ReturnInstance>();
        foreach (var returnal in returns) {
            if (returnal.ReturnItems is null) {
                continue;
            }
            var returnInstance = new ReturnInstance(
                returnal.Id,
                returnal.StaffId,
                returnal.ReaderId,
                returnal.Date,
                []
            );
            foreach (var returnItem in returnal.ReturnItems) {
                returnInstance.Cart.Add(
                    new ReturnPosition(
                        returnItem.Id,
                        returnItem.Book,
                        returnItem.Book?.Category?.Category,
                        returnItem.Quantity
                    )
                );
            }
        }
        if (returnList.Count == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(returnList);
    }
}