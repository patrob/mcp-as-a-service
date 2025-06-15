using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace OnParDev.Mcp.Api.Config;

public static class Services
{
    public static IServiceCollection AddConfigServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.Configure<GoogleSsoSettings>(configuration.GetSection("GoogleSSO"));
        return services;
    }
}
