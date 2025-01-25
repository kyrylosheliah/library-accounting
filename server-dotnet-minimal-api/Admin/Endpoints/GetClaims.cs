namespace LibAcct.Admin.Endpoints;

public class GetClaims : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/claims", Handle)
        .WithSummary("Get filtered userclaims on page with page size")
        .RequireAuthorization("IsAdmin");

    public record Response(int PageCount, List<UserClaim> Result);

    private static async Task<IResult> Handle(
        HttpContext context,
        PagedEntityFilterRequest request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        IQueryable<UserClaim> entities = database.UserClaims.AsQueryable();
        var (pageCount, result) = await entities.ToPagedFilteredListAsync(
            new UserClaim(),
            request,
            cancellationToken
        );
        if (pageCount == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(new Response(pageCount, result));
    }
}