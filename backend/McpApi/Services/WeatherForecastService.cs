using McpApi.Models;

namespace McpApi.Services;

public interface IWeatherForecastService
{
    IEnumerable<WeatherForecast> GetForecast(int days);
}

public class WeatherForecastService : IWeatherForecastService
{
    private static readonly string[] Summaries =
    [
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot",
        "Sweltering", "Scorching"
    ];

    public IEnumerable<WeatherForecast> GetForecast(int days)
    {
        return Enumerable.Range(1, days).Select(index =>
            new WeatherForecast(
                DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                Random.Shared.Next(-20, 55),
                Summaries[Random.Shared.Next(Summaries.Length)]));
    }
}
