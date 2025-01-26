using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class EnrollmentEventCrud : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<EnrollmentEvent>.MapEndpoints(app, new CrudSpecification<EnrollmentEvent> {
            AuthorizationPolicies = [ "IsAdmin" ],
            EnsureUniqueBeforePost = [ "Event" ],
        });
    }
}