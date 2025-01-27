using LibAcct.App.Crud;

namespace LibAcct.Librarian.Endpoints;

public class CrudAppointment : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Appointment>.MapEndpoints(app, new CrudSpecification<Appointment> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            EnsureUniqueBeforePost = [ "Date", "StaffId" ],
            EnsureExistsBeforePost = async (request, database, cancellationToken) =>
                await database.Set<User>().FirstOrDefaultAsync(
                    x => x.Id == request.StaffId, cancellationToken
                ) is null ? TypedResults.NotFound("Such user does not exist") : null,
            ModifyBeforePost = async (request, context, database, cancellationToken) => {
                request.Created = DateTime.UtcNow;
                request.Modified = DateTime.UtcNow;
                return null;
            },
            ModifyBeforePut = (request, found) => {
                request.Created = found.Created;
                request.Modified = DateTime.UtcNow;
            }
        });
    }
}