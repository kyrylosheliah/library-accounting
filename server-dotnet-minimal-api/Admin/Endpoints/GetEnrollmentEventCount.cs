namespace LibAcct.Admin.Endpoints;

public class GetEnrollmentEventCount : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/enrollmentevent/count", Handle)
        .WithSummary("Count EnrollmentEvent table entities")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        return TypedResults.Ok(await database.EnrollmentEvents.CountAsync(cancellationToken));
    }
}