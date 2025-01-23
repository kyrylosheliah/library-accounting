namespace LibAcct.Common.Api;

public interface IEndpoint {
    static abstract void Map(IEndpointRouteBuilder app);
}