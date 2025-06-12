using Microsoft.Extensions.DependencyInjection;
using McpApi.Services;

namespace McpApi.Config;

public static class Services
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IWeatherForecastService, WeatherForecastService>();
        return services;
    }
}
