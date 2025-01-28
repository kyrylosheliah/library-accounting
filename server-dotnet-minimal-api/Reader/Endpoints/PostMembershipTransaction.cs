using LibAcct.Librarian.Services;

namespace LibAcct.Reader.Endpoints;

public class PostMembershipTransaction : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) => app
        .MapPost("/membership/transaction", Handle)
        .WithSummary("Post the intent to top up the membership balance");

    private static async Task<IResult> Handle(
        decimal amount,
        HttpContext context,
        AppDatabase database,
        CancellationToken cancellationToken
    ) {
        var user = await AccountingService.AccessUserThroughMembership(context, database, cancellationToken);
        if (user is null) {
            return TypedResults.NotFound("There is no active membership, or such user does not exist");
        }
        var membership = user.Memberships.FirstOrDefault();
        if (membership is not null) {
            membership.ExpirationDate = membership.ExpirationDate.AddDays((double)amount);
            if (await database.SaveChangesAsync(cancellationToken) == 0) {
                return TypedResults.InternalServerError();
            }
            return TypedResults.Ok(membership);
        }
        var created = database.MembershipTransactions.Add(new MembershipTransaction() {
            Id = 0,
            ReaderId = user.Id,
            Amount = amount,
            Date = DateTime.UtcNow
        });
        if (await database.SaveChangesAsync(cancellationToken) == 0) {
            return TypedResults.InternalServerError();
        }
        database.Memberships.Add(new Membership() {
            Id = 0,
            ReaderId = user.Id,
            StartDate = created.Entity.Date,
            ExpirationDate = created.Entity.Date.AddDays((double)amount)
        });
        return TypedResults.Created(nameof(PostMembershipTransaction), created.CurrentValues.ToObject());
    }
}