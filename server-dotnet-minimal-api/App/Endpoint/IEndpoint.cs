namespace LibAcct.App.Endpoint;

public interface IEndpoint {
    static abstract void Map(IEndpointRouteBuilder app);
}