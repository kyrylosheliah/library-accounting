using LibAcct.App.PagedFilter;

namespace LibAcct.Library.Endpoints;

public class PostSearch : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/search", Handle)
        .WithSummary("Get a specific category by ID");

    public record Response(int PageCount, List<Book> Result);

    private static async Task<IResult> Handle(
        PagedEntityFilterRequest request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var books = database.Books.AsQueryable();
        var (pageCount, result) = await books.ToPagedFilteredListAsync(
            new Book(),
            request,
            cancellationToken
        );
        if (pageCount == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(new Response(pageCount, result));
    }
}