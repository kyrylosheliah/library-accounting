using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudAppointment : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Appointment>.MapEndpoints(app, new CrudSpecification<Appointment> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "Date", "StaffId" ],
            DoBeforePost = async (request, context, database, cancellationToken) => {
                var userFound = await database.Set<User>().FirstOrDefaultAsync(
                    x => x.Id == request.StaffId, cancellationToken
                );
                if (userFound is null) {
                    return TypedResults.NotFound("Such user does not exist");
                }
                request.Created = DateTime.UtcNow;
                request.Modified = DateTime.UtcNow;
                return null;
            },
            DoBeforePut = (request, found) => {
                request.Created = found.Created;
                request.Modified = DateTime.UtcNow;
            }
        });
    }
}