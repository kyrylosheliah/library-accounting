namespace LibAcct.Library.Endpoints;

public class GetCategory : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/category/{Id}", Handle)
        .WithSummary("Get a specific category by ID");

    private static async Task<IResult> Handle(
        int Id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.BookCategories
            .FirstOrDefaultAsync(x => x.Id == Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}