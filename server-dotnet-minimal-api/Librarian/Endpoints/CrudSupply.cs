using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudSupply : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Supply>.MapEndpoints(app, new CrudSpecification<Supply> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            ModifyBeforePost = x => {
                x.Date = DateTime.UtcNow;
            },
            ModifyBeforePut = (x, y) => {
                x.Date = y.Date;
            }
        });
    }
}