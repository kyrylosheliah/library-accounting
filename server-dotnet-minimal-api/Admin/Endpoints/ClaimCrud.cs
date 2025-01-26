using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class ClaimCrud : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<UserClaim>.MapEndpoints(app, new CrudSpecification<UserClaim> {
            AuthorizationPolicies = [ "IsAdmin" ],
            EnsureUniqueBeforePost = [ "UserId", "Type", "Value" ],
        });
    }
}