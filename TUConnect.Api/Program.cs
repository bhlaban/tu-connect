using Microsoft.EntityFrameworkCore;
using TUConnect.Data;
using Microsoft.FeatureManagement;

var builder = WebApplication.CreateBuilder(args);

// Add Azure App Configuration for Feature Flags
var connectionString = builder.Configuration.GetConnectionString("AppConfiguration");
if (!string.IsNullOrEmpty(connectionString))
{
    builder.Configuration.AddAzureAppConfiguration(options =>
    {
        options.Connect(connectionString)
               .UseFeatureFlags();
    });
}

// Add services to the container.
builder.Services.AddControllers();

// Add OpenAPI/Swagger
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add Database Context
builder.Services.AddDbContext<TUConnectDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Add Feature Management
builder.Services.AddFeatureManagement();

// Add Application Insights
builder.Services.AddApplicationInsightsTelemetry();

// Add CORS for MAUI client
builder.Services.AddCors(options =>
{
    options.AddPolicy("MauiClient", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("MauiClient");

app.UseAuthorization();

app.MapControllers();

app.Run();
