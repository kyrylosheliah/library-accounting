using LibAcct.App.Crud;
using LibAcct.Librarian.Services;

namespace LibAcct.Librarian.Endpoints;

public class CrudBook : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Book>.MapEndpoints(app, new CrudSpecification<Book> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            DoAfterDelete = x => {
                BookCoverService.DeleteBookCover(x);
            },
            EnsureUniqueBeforePost = [ "Isbn", "Title" ],
            EnsureExistsBeforePost = async (request, database, cancellationToken) =>
                await database.Set<BookCategory>().FirstOrDefaultAsync(
                    x => x.Id == request.CategoryId, cancellationToken
                ) is not null,
        });
    }
}