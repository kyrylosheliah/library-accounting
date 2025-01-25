using LibAcct.App.Data;

namespace LibAcct.Admin.Endpoints;

public class PutEnrollmentEvent : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPut("/enrollmentevent", Handle)
        .WithSummary("Update an enrollmentevent record fields with matching ID field")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        EnrollmentEvent request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.EnrollmentEvents.FirstOrDefaultAsync(x => x.Id == request.Id, cancellationToken);
        if (found is null) {
            return TypedResults.NotFound();
        }
        database.EnrollmentEvents.Entry(found).CurrentValues.SetValues(request);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to modify the user record");
        }
        return TypedResults.Ok();
    }
}