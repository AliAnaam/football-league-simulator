using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.Repositories;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services;
using LigaSim.API.Services.Interfaces;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Configure Database Context (SQLite for local development, PostgreSQL for cloud)
builder.Services.AddDbContext<LigaSimDbContext>(options =>
{
    var envUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    
    if (string.IsNullOrEmpty(envUrl))
    {
        // 1. Local Mode: Keep using SQLite file
        var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ligasim.db";
        options.UseSqlite(connectionString);
    }
    else
    {
        // 2. Cloud Mode: Parse the Neon connection string for PostgreSQL
        var databaseUri = new Uri(envUrl);
        var userInfo = databaseUri.UserInfo.Split(':');

        var pgConnectionString = $"Host={databaseUri.Host};" +
                                 $"Port={databaseUri.Port};" +
                                 $"User Id={userInfo[0]};" +
                                 $"Password={userInfo[1]};" +
                                 $"Database={databaseUri.AbsolutePath.TrimStart('/')};" +
                                 $"SSL Mode=Require;Trust Server Certificate=true;";

        options.UseNpgsql(pgConnectionString);
    }
});

// Register Repositories
builder.Services.AddScoped<ITeamRepository, TeamRepository>();
builder.Services.AddScoped<IMatchRepository, MatchRepository>();
builder.Services.AddScoped<IScorerRepository, ScorerRepository>();

// Register Services
builder.Services.AddScoped<ITeamService, TeamService>();
builder.Services.AddScoped<IMatchService, MatchService>();
builder.Services.AddScoped<ISimulationService, SimulationService>();
builder.Services.AddScoped<IAuthService, AuthService>();

// Configure CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true) // always enable Swagger for easy local exploration
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowAll");

app.UseAuthorization();

app.MapControllers();

// Apply migrations and generate initial fixtures if database is empty
using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;
    try
    {
        var db = services.GetRequiredService<LigaSimDbContext>();
        db.Database.EnsureCreated(); // Ensure DB is created with seed data

        // Generate initial fixtures if none exist
        var matchService = services.GetRequiredService<IMatchService>();
        var matches = await matchService.GetAllMatchesAsync();
        if (!matches.Any())
        {
            await matchService.GenerateFixturesAsync();
        }
    }
    catch (Exception ex)
    {
        var logger = services.GetRequiredService<ILogger<Program>>();
        logger.LogError(ex, "An error occurred while seeding or migrating the database.");
    }
}

app.Run();
