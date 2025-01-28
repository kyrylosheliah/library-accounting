using LibAcct.Librarian.Services;

namespace LibAcct.Reader.Endpoints;

public class GetMembership : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/membership", Handle)
        .WithSummary("Get current membership status");

    private static async Task<IResult> Handle(
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await AccountingService.AccessUserThroughMembership(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("There is no active membership, or such user does not exist");
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(membership);
    }
}