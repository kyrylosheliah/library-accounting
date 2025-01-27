using LibAcct.App.Crud;
using LibAcct.Authentication.Services;

namespace LibAcct.Librarian.Endpoints;

public class CrudReturn : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Return>.MapEndpoints(app, new CrudSpecification<Return> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            ModifyBeforePost = async (request, context, database, cancellationToken) => {
                var staffId = JwtService.ExtractUserIdFromToken(context);
                if (staffId is null) {
                    // should be unreachable when the endpoint requres authorization policies
                    return TypedResults.Unauthorized();
                }
                var staff = await database.Users.FirstOrDefaultAsync(x => x.Id == staffId, cancellationToken);
                if (staff is null) {
                    return TypedResults.NotFound("Such staff does not exist");
                }
                request.StaffId = (int)staffId;
                request.Date = DateTime.UtcNow;
                return null;
            },
            ModifyBeforePut = (request, found) => {
                request.StaffId = found.StaffId;
                request.Date = found.Date;
            }
        });
    }
}