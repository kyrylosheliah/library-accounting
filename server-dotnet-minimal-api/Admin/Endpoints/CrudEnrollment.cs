using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class CrudEnrollment : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Enrollment>.MapEndpoints(app, new CrudSpecification<Enrollment> {
            AuthorizationPolicies = [ "IsAdmin" ],
            EnsureUniqueBeforePost = [ "StaffId", "EventId" ],
            DoBeforePost = async (request, context, database, cancellationToken) => {
                var userFound = await database.Set<User>().FirstOrDefaultAsync(
                    e => e.Id == request.StaffId, cancellationToken
                );
                if (userFound is null) {
                    return TypedResults.NotFound("Such user does not exist");
                }
                database.UserClaims.Add(
                    new UserClaim() {
                        Id = 0,
                        UserId = request.StaffId,
                        Type = "librarian",
                        Value = "true"
                    }
                );
                request.EventDate = DateTime.UtcNow;
                return null;
            },
            ForbidPut = true,
            DoBeforeDelete = (found, database) => {
                var foundClaims = database.UserClaims.Where(x => x.UserId == found.StaffId).ToList();
                if (foundClaims.Count > 0) {
                    database.UserClaims.RemoveRange(foundClaims);
                }
            }
        });
    }
}