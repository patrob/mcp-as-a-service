using McpApi.Config;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddApplicationServices();
builder.Services.AddCorsPolicies();

var app = builder.Build();

app.UseSwagger(options =>
{
    options.RouteTemplate = "/openapi/{documentName}.json";
});
app.MapScalarApiReference("/scalar");

app.UseCors();

app.UseFrontend(builder.Environment);

app.MapEndpoints();

app.Run();
