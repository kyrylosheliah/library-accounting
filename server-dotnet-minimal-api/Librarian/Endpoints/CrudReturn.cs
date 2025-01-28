using LibAcct.App.Crud;
using LibAcct.Authentication.Services;

namespace LibAcct.Librarian.Endpoints;

public class CrudReturn : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Return>.MapEndpoints(app, new CrudSpecification<Return> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            DoBeforePost = async (request, context, database, cancellationToken) => {
                var staff = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
                if (staff is null) {
                    // should be unreachable when the endpoint requres authorization policies
                    return TypedResults.NotFound("Such staff does not exist");
                }
                request.StaffId = staff.Id;
                request.Date = DateTime.UtcNow;
                return null;
            },
            DoBeforePut = (request, found) => {
                request.StaffId = found.StaffId;
                request.Date = found.Date;
            }
        });
    }
}