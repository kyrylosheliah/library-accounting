using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class DeleteBookCover : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/book/cover/{Id}", Handle)
        .WithSummary("Delete the book's cover image by ID");

    private static async Task<IResult> Handle(
        int Id,
        AppDatabase database,
        AppSettings settings,
        CancellationToken cancellationToken
    ) {
        var found = await database.Books.FirstOrDefaultAsync(e => e.Id == Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        var deleted = BookCoverService.DeleteBookCover(Id);
        if (deleted) {
            return TypedResults.NoContent();
        }
        return TypedResults.NotFound();
    }
}