using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class PostBookCover : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/book/cover", Handle)
        .WithSummary("Post the book's cover image by ID");

    public record Request(int Id, IFormFile File);

    private static async Task<IResult> Handle(
        Request request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.Books.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        try {
            await BookCoverService.WriteBookCover(request.Id, request.File);
        } catch (Exception e) {
            return TypedResults.BadRequest(e.Message);
        }
        return TypedResults.Ok();
    }
}