using LibAcct.App.Crud;

namespace LibAcct.Admin.Endpoints;

public class CrudUser : IEndpoint {
    public static void Map(IEndpointRouteBuilder app) {
        Crud<User>.MapEndpoints(app, new CrudSpecification<User> {
            AuthorizationPolicies = [ "IsAdmin" ],
            ModifyAfterGet = x => {
                x.PasswordHash = "";
            },
            ModifyAfterGetMultiple = x => {
                x.PasswordHash = "";
            },
            EnsureUniqueBeforePost = [ "Email" ],
            ModifyBeforePost = x => {
                x.RegisterDate = DateTime.UtcNow;
                x.PasswordHash = BCrypt.Net.BCrypt.HashPassword(x.PasswordHash);
            },
            ModifyAfterPost = x => {
                x.PasswordHash = "";
            },
            ModifyBeforePut = (x, y) => {
                if (x.PasswordHash.Length == 0) {
                    x.PasswordHash = y.PasswordHash;
                } else {
                    x.PasswordHash = BCrypt.Net.BCrypt.HashPassword(x.PasswordHash);
                }
            }
        });
    }
}