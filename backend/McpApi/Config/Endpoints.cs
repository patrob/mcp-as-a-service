using McpApi.Services;

namespace McpApi.Config;

public static class Endpoints
{
    public static WebApplication MapEndpoints(this WebApplication app)
    {
        app.MapGet("/weatherforecast", (IWeatherForecastService service) =>
            service.GetForecast(5));

        return app;
    }
}
