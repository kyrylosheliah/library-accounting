using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class GetWishes : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/wishes", Handle)
        .WithSummary("Get the list of the books which are present in the list of favorites");

    public record WishInstance(
        int Id,
        Book? Book,
        string? BookCategory
    );

    private static async Task<IResult> Handle(
        int Id,
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("Such user does not exist");
        }
        var wishes = await database.Wishes
            .Include(x => x.Book)
            .ThenInclude(x => x.Category)
            .Where(x => x.UserId == user.Id)
            .ToListAsync(cancellationToken);
        if (wishes is null) {
            return TypedResults.NotFound();
        }
        var wishList = new List<WishInstance>();
        foreach (var wish in wishes) {
            wishList.Add(new WishInstance(
                wish.Id,
                wish.Book,
                wish.Book?.Category?.Category
            ));
        }
        return TypedResults.Ok(wishList);
    }
}