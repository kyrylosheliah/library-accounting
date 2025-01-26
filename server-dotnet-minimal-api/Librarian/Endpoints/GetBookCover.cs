using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class GetBookCover : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/book/cover/{Id}", Handle)
        .WithSummary("Get the book's cover image by ID");

    private static async Task<IResult> Handle(
        int Id
    ) {
        var cover = await BookCoverService.ReadBookCover(Id);
        if (cover is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(cover);
    }
}