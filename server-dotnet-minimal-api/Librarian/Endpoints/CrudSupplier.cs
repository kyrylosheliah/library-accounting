using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudSupplier : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Supplier>.MapEndpoints(app, new CrudSpecification<Supplier> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "Phone" ],
        });
    }
}