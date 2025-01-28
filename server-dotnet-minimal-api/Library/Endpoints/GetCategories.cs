namespace LibAcct.Library.Endpoints;

public class GetCategories : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/categories", Handle)
        .WithSummary("Get all possible categories dynamically to give the frontend an ability to compose the filtered search request");

    private static async Task<IResult> Handle(
        AppDatabase database
    ) {
        return TypedResults.Ok(await database.BookCategories.ToListAsync());
    }
}