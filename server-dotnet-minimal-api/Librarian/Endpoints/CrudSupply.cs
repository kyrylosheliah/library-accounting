using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudSupply : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Supply>.MapEndpoints(app, new CrudSpecification<Supply> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            ModifyBeforePost = async (request, context, database, cancellationToken) => {
                request.Date = DateTime.UtcNow;
                return null;
            },
            ModifyBeforePut = (request, found) => {
                request.Date = found.Date;
            }
        });
    }
}