using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.FileProviders;
using System.IO;

namespace McpApi.Config;

public static class Frontend
{
    public static WebApplication UseFrontend(this WebApplication app, IWebHostEnvironment env)
    {
        var path = Path.Combine(env.ContentRootPath, "..", "frontend", "out");
        if (!Directory.Exists(path))
        {
            return app;
        }

        app.UseDefaultFiles(new DefaultFilesOptions
        {
            FileProvider = new PhysicalFileProvider(path)
        });

        app.UseStaticFiles(new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(path)
        });

        app.MapFallbackToFile("/index.html", new StaticFileOptions
        {
            FileProvider = new PhysicalFileProvider(path)
        });

        return app;
    }
}
