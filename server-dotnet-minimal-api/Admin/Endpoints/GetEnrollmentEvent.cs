namespace LibAcct.Admin.Endpoints;

public class GetEnrollmentEvent : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapGet("/enrollmentevent/{id}", Handle)
        .WithSummary("Get an enrollmentevent record by ID")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        int id,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.EnrollmentEvents.FirstOrDefaultAsync(x => x.Id == id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(found);
    }
}