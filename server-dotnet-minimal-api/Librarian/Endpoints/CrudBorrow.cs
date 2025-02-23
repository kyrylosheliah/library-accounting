using LibAcct.App.Crud;
using LibAcct.Librarian.Services;
using LibAcct.Authentication.Services;

namespace LibAcct.Librarian.Endpoints;

public class CrudBorrow : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<Borrow>.MapEndpoints(app, new CrudSpecification<Borrow> {
            AuthorizationPolicies = [ "IsAdmin", "IsLibrarian" ],
            DoBeforePost = async (request, context, database, cancellationToken) => {
                var reader = await AccountingService.AccessUserThroughMembership(request.ReaderId, database, cancellationToken);
                if (reader is null) {
                    return TypedResults.NotFound("There is no active membership, or such user does not exist");
                };
                var staff = await JwtService.ExtractUserFromToken(context, database, cancellationToken);
                if (staff is null) {
                    // should be unreachable when the endpoint requres authorization policies
                    return TypedResults.Unauthorized();
                }
                var staffId = staff.Id;
                if (staff is null) {
                    return TypedResults.NotFound("Such staff does not exist");
                }
                request.StaffId = (int)staffId;
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