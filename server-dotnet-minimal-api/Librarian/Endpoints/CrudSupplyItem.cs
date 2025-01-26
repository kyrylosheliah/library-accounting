using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudSupplyItem : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<SupplyItem>.MapEndpoints(app, new CrudSpecification<SupplyItem> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "BookId", "SupplyId" ],
        });
    }
}