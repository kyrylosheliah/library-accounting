using LibAcct.App.Data;

namespace LibAcct.Admin.Endpoints;

public class PostEnrollmentEvent : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/enrollmentevent", Handle)
        .WithSummary("Create a new user record")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        HttpContext context,
        EnrollmentEvent request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.EnrollmentEvents.FirstOrDefaultAsync(x => x.Event == request.Event, cancellationToken);
        if (found is not null) {
            return TypedResults.Conflict();
        }
        request.Id = 0;
        var created = await database.EnrollmentEvents.AddAsync(request, cancellationToken);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to add an enrollmentevent record");
        }
        return TypedResults.Created(nameof(PostEnrollmentEvent), created.CurrentValues.ToObject());
    }
}