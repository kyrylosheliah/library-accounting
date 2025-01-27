using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class PostShelfSupply : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/shelf/supply/{Id}", Handle)
        .WithSummary("Account book stock by supply ID");

    private static async Task<IResult> Handle(
        int Id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        string message = await AccountingService.AccountShelfSupply(database, Id, cancellationToken);
        if (message != "") {
            return TypedResults.BadRequest(message);
        }
        return TypedResults.Ok();
    }
}