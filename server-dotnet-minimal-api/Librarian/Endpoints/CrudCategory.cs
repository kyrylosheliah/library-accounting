using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudCategory : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<BookCategory>.MapEndpoints(app, new CrudSpecification<BookCategory> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "Category" ],
        });
    }
}