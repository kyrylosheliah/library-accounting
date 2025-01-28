using LibAcct.Authentication.Services;

namespace LibAcct.Reader.Endpoints;

public class DeleteWish : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapDelete("/wish/{Id}", Handle)
        .WithSummary("Delete the fact that a book with an ID exists in the list of favorites");

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
        var found = database.Wishes.FirstOrDefault(x => x.BookId == Id && x.UserId == user.Id);
        if (found is null) {
            return TypedResults.NotFound();
        }
        database.Wishes.Remove(found);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError();
        }
        return TypedResults.Ok(found);
    }
}