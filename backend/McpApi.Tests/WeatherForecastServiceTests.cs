using McpApi.Services;

namespace McpApi.Tests;

public class WeatherForecastServiceTests
{
    [Fact]
    public void GetForecast_ReturnsRequestedNumberOfItems()
    {
        var service = new WeatherForecastService();

        var result = service.GetForecast(5);

        Assert.Equal(5, result.Count());
    }

    [Fact]
    public void GetForecast_ProducesTemperaturesWithinExpectedRange()
    {
        var service = new WeatherForecastService();

        var result = service.GetForecast(10);

        Assert.All(result, f => Assert.InRange(f.TemperatureC, -20, 55));
    }
}
