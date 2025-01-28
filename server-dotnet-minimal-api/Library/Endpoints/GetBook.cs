namespace LibAcct.Library.Endpoints;

public class GetBook : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/book/{Id}", Handle)
        .WithSummary("Get the book info to display in the frontend part");

    public record Response(int Quantity, int Wishes, Book Result);

    private static async Task<IResult> Handle(
        int Id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Books
            .Include(e => e.Shelves)
            .Include(e => e.Wishes)
            .FirstOrDefaultAsync(b => b.Id == Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        var shelves = found.Shelves.Select(e => e.Quantity).Sum();
        var wishes = found.Wishes.Count;
        return TypedResults.Ok(new Response(shelves, wishes, found));
    }
}