using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class PostWish : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/wish/{Id}", Handle)
        .WithSummary("Post the intent to add a book with an ID to the list of favorites");

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
        var bookFound = await database.Books.FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        if (bookFound is null) {
            return TypedResults.NotFound();
        }
        var found = bookFound.Wishes.FirstOrDefault(x => x.UserId == user.Id);
        if (found is not null) {
            return TypedResults.Conflict();
        }
        var created = database.Wishes.Add(new Wish() {
            Id = 0,
            UserId = user.Id,
            BookId = Id
        });
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError();
        }
        return TypedResults.Created(nameof(PostWish), created.CurrentValues.ToObject());
    }
}