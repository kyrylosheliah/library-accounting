using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class CrudUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<User>.MapEndpoints(app, new CrudSpecification<User> {
            AuthorizationPolicies = [ "IsAdmin" ],
            ModifyAfterGet = request => {
                request.PasswordHash = "";
            },
            ModifyAfterGetMultiple = request => {
                request.PasswordHash = "";
            },
            EnsureUniqueBeforePost = [ "Email" ],
            ModifyBeforePost = async (request, context, database, cancellationToken) => {
                request.RegisterDate = DateTime.UtcNow;
                request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
                return null;
            },
            ModifyAfterPost = async (request, created, database, cancellationToken) => {
                request.PasswordHash = "";
            },
            ModifyBeforePut = (request, found) => {
                if (request.PasswordHash.Length == 0) {
                    request.PasswordHash = found.PasswordHash;
                } else {
                    request.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.PasswordHash);
                }
            }
        });
    }
}