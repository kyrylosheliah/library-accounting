using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class CrudEnrollment : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Enrollment>.MapEndpoints(app, new CrudSpecification<Enrollment> {
            AuthorizationPolicies = [ "IsAdmin" ],
            EnsureUniqueBeforePost = [ "StaffId", "EventId" ],
            EnsureExistsBeforePost = async (request, database, cancellationToken) => 
                await database.Set<User>().FirstOrDefaultAsync(
                    e => e.Id == request.StaffId, cancellationToken
                ) is not null,
            ModifyBeforePost = x => {
                x.EventDate = DateTime.UtcNow;
            },
            ForbidPut = true
        });
    }
}