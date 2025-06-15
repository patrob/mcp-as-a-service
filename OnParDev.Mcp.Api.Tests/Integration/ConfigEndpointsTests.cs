using System.Net.Http.Json;

using OnParDev.Mcp.Api.Config;

namespace OnParDev.Mcp.Api.Tests.Integration;

public class ConfigEndpointsTests : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client;
    public ConfigEndpointsTests(ApiFactory factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task ReturnsGoogleClientId()
    {
        var response = await _client.GetFromJsonAsync<ConfigResponse>("/api/config");
        Assert.NotNull(response);
        Assert.Equal(string.Empty, response!.GoogleClientId);
    }
}
