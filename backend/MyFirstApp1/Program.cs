using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

Dictionary<string, List<SubactivityDTO>> savedSnapshots = new();

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddCors();

var app = builder.Build();

app.UseCors(policy =>
    policy.AllowAnyOrigin()
          .AllowAnyMethod()
          .AllowAnyHeader()
);

app.MapDelete("/api/subactivities/{name}", (string name) =>
{
    if (savedSnapshots.Remove(name))
    {
        Console.WriteLine($"🗑️ Deleted snapshot: {name}");
        return Results.Ok();
    }
    return Results.NotFound("Snapshot not found.");
});


// GET: Return saved data
app.MapGet("/api/subactivities/{name}", (string name) =>
{
    if (savedSnapshots.TryGetValue(name, out var snapshot))
    {
        return Results.Ok(snapshot);
    }
    return Results.NotFound("Snapshot not found.");
});

app.MapGet("/api/snapshots", () =>
{
    var names = savedSnapshots.Keys.ToList();
    return Results.Ok(names);
});


var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};
  
// POST: Receive and store updated data
app.MapPost("/api/subactivities/{name}", async (HttpContext context, string name) =>
{
    var data = await JsonSerializer.DeserializeAsync<List<SubactivityDTO>>(context.Request.Body, options);
    if (data is not null)
    {
        savedSnapshots[name] = data;
        Console.WriteLine($"✅ Saved snapshot '{name}' with {data.Count} subactivities.");
        return Results.Ok();
    }
    return Results.BadRequest("Invalid data.");
});

foreach (var endpoint in app.Services.GetRequiredService<EndpointDataSource>().Endpoints)
{
    Console.WriteLine($"📌 Endpoint: {endpoint.DisplayName}");
}


app.Run();
