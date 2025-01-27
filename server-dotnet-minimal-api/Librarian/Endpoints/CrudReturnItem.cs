using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudReturnItem : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<ReturnItem>.MapEndpoints(app, new CrudSpecification<ReturnItem> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "BookId", "ReturnId" ],
        });
    }
}