using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;

namespace OnParDev.Mcp.Api.WeatherForecast;

public static class Endpoints
{
    private static readonly string[] Summaries =
    [
        "Freezing",
        "Bracing",
        "Chilly",
        "Cool",
        "Mild",
        "Warm",
        "Balmy",
        "Hot",
        "Sweltering",
        "Scorching"
    ];

    public static void MapWeatherForecastEndpoints(this IEndpointRouteBuilder app)
    {
        app.MapGet("/weatherforecast", GetForecasts)
            .WithName("GetWeatherForecast");
    }

    private static IEnumerable<OnParDev.Mcp.Api.WeatherForecast.WeatherForecast> GetForecasts()
        => Enumerable.Range(1, 5).Select(index =>
            new OnParDev.Mcp.Api.WeatherForecast.WeatherForecast(
                DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                Random.Shared.Next(-20, 55),
                Summaries[Random.Shared.Next(Summaries.Length)]));
}
