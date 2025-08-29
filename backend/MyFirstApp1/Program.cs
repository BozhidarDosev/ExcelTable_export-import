using System.Text.Json;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;

List<SubactivityDTO> savedSubactivities = [];

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

var options = new JsonSerializerOptions
{
    PropertyNameCaseInsensitive = true
};

// POST: Receive and store updated data
app.MapPost("/api/subactivities", async (HttpContext context) =>
{
    var data = await JsonSerializer.DeserializeAsync<List<SubactivityDTO>>(context.Request.Body, options);

    if (data != null)
    {
        savedSubactivities = data;
        Console.WriteLine($"✅ Received {data.Count} subactivities.");
        foreach (var subactivity in data)
        {
            Console.WriteLine($"   - CurrentQuantity: {subactivity.CurrentQuantity}, RequestedQuantity: {subactivity.RequestedQuantity}, UnitOfMeasure: {subactivity.UnitOfMeasure}, ContractPrice: {subactivity.ContractPrice}, ExpectedTotalPrice: {subactivity.ExpectedTotalPrice}");
        }   
        return Results.Ok();
    }

    return Results.BadRequest("Invalid data.");
});

app.Run();
