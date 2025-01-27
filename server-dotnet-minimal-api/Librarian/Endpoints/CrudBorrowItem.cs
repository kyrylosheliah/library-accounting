using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudBorrowItem : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<BorrowItem>.MapEndpoints(app, new CrudSpecification<BorrowItem> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "BookId", "BorrowId" ],
            DoBeforeDelete = (found, database) => {
                var debtFound = database.Debts.FirstOrDefault(x => x.BorrowItemId == found.Id);
                if (debtFound is not null) {
                    database.Debts.Remove(debtFound);
                }
            },
            ModifyBeforePost = async (request, context, database, cancellationToken) => {
                var borrowFound = await database.Borrows.FirstOrDefaultAsync(x => x.Id == request.BorrowId, cancellationToken);
                if (borrowFound is null) {
                    return TypedResults.NotFound("Such borrow does not exist");
                }
                var bookFound = await database.Books.FirstOrDefaultAsync(x => x.Id == request.BookId, cancellationToken);
                if (bookFound is null) {
                    return TypedResults.NotFound("Such book does not exist");
                }
                int daysToAdd = 14;
                if (bookFound.BookingPolicy is not null) {
                    if (bookFound.BookingPolicy > 0) {
                        daysToAdd = (int)bookFound.BookingPolicy;
                    }
                }
                request.ExpirationDate = borrowFound.Date.AddDays(daysToAdd);
                
                return null;
            },
            ModifyAfterPost = async (request, created, database, cancellationToken) => {
                var borrowFound = await database.Borrows.FirstOrDefaultAsync(x => x.Id == request.BorrowId, cancellationToken);
                var debtCreated = await database.Debts.AddAsync(
                    new Debt() {
                        Id = 0,
                        ReaderId = borrowFound.ReaderId,
                        BorrowItemId = created.Id,
                    },
                    cancellationToken
                );
            }
        });
    }
}