using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using Microsoft.Extensions.Options;

namespace OnParDev.Mcp.Api.Config;

public static class Endpoints
{
    public static IEndpointRouteBuilder MapConfigEndpoints(this IEndpointRouteBuilder endpoints)
    {
        endpoints.MapGet("/api/config", (IOptions<GoogleSsoSettings> google) =>
            Results.Ok(new ConfigResponse(google.Value.ClientId)));
        return endpoints;
    }
}
