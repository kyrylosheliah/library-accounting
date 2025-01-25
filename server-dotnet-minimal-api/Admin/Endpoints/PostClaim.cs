using LibAcct.App.Data;

namespace LibAcct.Admin.Endpoints;

public class PostClaim : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/claim", Handle)
        .WithSummary("Create a new userclaim record")
        .RequireAuthorization("IsAdmin");

    private static async Task<IResult> Handle(
        UserClaim request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var found = await database.UserClaims.FirstOrDefaultAsync(
            x => x.UserId == request.UserId && x.Type == request.Type && x.Value == request.Value,
            cancellationToken
        );
        if (found is not null) {
            return TypedResults.Conflict();
        }
        request.Id = 0;
        var created = await database.UserClaims.AddAsync(request, cancellationToken);
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError("Failed to add a userclaim record");
        }
        return TypedResults.Created(nameof(PostClaim), created.CurrentValues.ToObject());
    }
}