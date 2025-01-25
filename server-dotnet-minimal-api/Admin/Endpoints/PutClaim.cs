namespace LibAcct.Admin.Endpoints;

public class PutClaim : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/claim", Handle)
        .WithSummary("Update userclaim fields at the record with the same ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        UserClaim request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.UserClaims.FirstOrDefaultAsync(c => c.Id == request.Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        database.UserClaims.Entry(found).CurrentValues.SetValues(request);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to modify the userclaim record");
        }
        return TypedResults.Ok();
    }
}