using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace McpApi.Config;

public static class Cors
{
    public static IServiceCollection AddCorsPolicies(this IServiceCollection services)
    {
        services.AddCors(options =>
        {
            options.AddDefaultPolicy(builder =>
            {
                builder.AllowAnyOrigin()
                       .AllowAnyMethod()
                       .AllowAnyHeader();
            });
        });

        return services;
    }
}
