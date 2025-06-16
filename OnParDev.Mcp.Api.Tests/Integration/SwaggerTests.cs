using System.Net.Http.Json;
using System.Text.Json.Nodes;

using Shouldly;

using Xunit;

namespace OnParDev.Mcp.Api.Tests.Integration;

public class SwaggerTests(ApiFactory factory) : IClassFixture<ApiFactory>
{
    private readonly HttpClient _client = factory.CreateClient();

    [Fact]
    public async Task DocumentContainsConfigEndpoint()
    {
        var json = await _client.GetFromJsonAsync<JsonObject>("/swagger/v1/swagger.json");
        var paths = json?["paths"]?.AsObject();
        (paths?.ContainsKey("/api/config")).ShouldBe(true);
    }
}
