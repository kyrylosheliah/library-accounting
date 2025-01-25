using LibAcct.App.Data;

namespace LibAcct.Admin.Endpoints;

public class GetUsers : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/users", Handle)
        .WithSummary("Get filtered users on page with page size")
        .RequireAuthorization("IsAdmin");

    public record Response(int PageCount, List<User> Result);

    private static async Task<IResult> Handle(
        HttpContext context,
        PagedEntityFilterRequest request,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        IQueryable<User> entities = database.Users.AsQueryable();
        var (pageCount, result) = await entities.ToPagedFilteredListAsync(
            new User(),
            request,
            cancellationToken
        );
        result = result
            .Select(
                x => {
                    x.PasswordHash = "";
                    return x;
                })
            .ToList();
        if (pageCount == 0) {
            return TypedResults.NotFound();
        }
        return TypedResults.Ok(new Response(pageCount, result));
    }
}