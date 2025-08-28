using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

List<SubactivityDTO> savedSubactivities = new();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader()
);

// GET: Return saved data
app.MapGet("/api/subactivities", () =>
{
    return Results.Ok(savedSubactivities);
});

// POST: Receive and store updated data
app.MapPost("/api/subactivities", async (HttpContext context) =>
{
    var data = await JsonSerializer.DeserializeAsync<List<SubactivityDTO>>(context.Request.Body);

    if (data != null)
    {
        savedSubactivities = data;
        Console.WriteLine($"✅ Received {data.Count} subactivities.");
        return Results.Ok();
    }

    return Results.BadRequest("Invalid data.");
});

app.Run();
