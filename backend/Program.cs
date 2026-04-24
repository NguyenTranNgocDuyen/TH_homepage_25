using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using TimesheetLeaveApi.Data;

var builder = WebApplication.CreateBuilder(args);

builder.WebHost.UseUrls(builder.Configuration["Urls"] ?? "http://localhost:5042");

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>() ??
                     new[] { "http://localhost:5173" };

builder.Services.AddCors(options =>
{
    options.AddPolicy("ViteClient", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .WithMethods("GET", "POST", "PUT", "DELETE")
            .AllowAnyHeader();
    });
});

var app = builder.Build();
var spaDistPath = Path.GetFullPath(Path.Combine(builder.Environment.ContentRootPath, "..", "dist"));
var hasSpaDist = Directory.Exists(spaDistPath);

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("ViteClient");

if (hasSpaDist)
{
    var spaFileProvider = new PhysicalFileProvider(spaDistPath);

    app.UseDefaultFiles(new DefaultFilesOptions
    {
        FileProvider = spaFileProvider
    });

    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = spaFileProvider
    });
}

app.MapControllers();

if (hasSpaDist)
{
    app.MapWhen(
        context => !context.Request.Path.StartsWithSegments("/api") &&
                   !context.Request.Path.StartsWithSegments("/swagger") &&
                   !Path.HasExtension(context.Request.Path.Value),
        spaApp =>
        {
            spaApp.Run(async context =>
            {
                context.Response.ContentType = "text/html; charset=utf-8";
                await context.Response.SendFileAsync(Path.Combine(spaDistPath, "index.html"));
            });
        });
}
else
{
    app.MapGet("/", () => Results.Text(
        "Frontend build not found. Run `npm run app` from the project root first.",
        "text/plain"));
}

app.Run();
