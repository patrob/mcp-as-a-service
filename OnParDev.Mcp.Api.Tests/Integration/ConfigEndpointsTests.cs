using System.Net.Http.Json;

using OnParDev.Mcp.Api.Config;

using Shouldly;

namespace OnParDev.Mcp.Api.Tests.Integration;

public class ConfigEndpointsTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task ReturnsGoogleClientId()
    {
        var response = await _client.GetFromJsonAsync<ConfigResponse>("/api/config");
        response.ShouldBe(new ConfigResponse(string.Empty));
    }
}
