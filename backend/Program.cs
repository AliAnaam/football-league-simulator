using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.Repositories;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services;
using LigaSim.API.Services.Interfaces;
using LigaSim.API.Models;

var builder = WebApplication.CreateBuilder(args);

// Bind to both port 8080 (Docker EXPOSE) and Render's dynamic PORT to prevent port mismatches
var urls = new List<string> { "http://+:8080" };
var customPort = Environment.GetEnvironmentVariable("PORT");
if (!string.IsNullOrEmpty(customPort) && customPort != "8080")
{
    urls.Add($"http://+:{customPort}");
}
builder.WebHost.UseUrls(urls.ToArray());

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
        // 2. Cloud Mode: Parse the Neon/Render connection string for PostgreSQL robustly
        try
        {
            string pgConnectionString;
            if (envUrl.StartsWith("postgres://") || envUrl.StartsWith("postgresql://"))
            {
                var databaseUri = new Uri(envUrl);
                var userInfo = databaseUri.UserInfo.Split(':');
                var user = Uri.UnescapeDataString(userInfo[0]);
                var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
                var host = databaseUri.Host;
                var portStr = databaseUri.Port == -1 ? "5432" : databaseUri.Port.ToString();
                var database = databaseUri.AbsolutePath.TrimStart('/');

                pgConnectionString = $"Host={host};Port={portStr};Database={database};Username={user};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
            }
            else
            {
                pgConnectionString = envUrl;
            }

            options.UseNpgsql(pgConnectionString);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Error parsing DATABASE_URL: {ex.Message}. Falling back to SQLite.");
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection") ?? "Data Source=ligasim.db";
            options.UseSqlite(connectionString);
        }
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

// Configure CORS - Standard Production Setup
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins(
                "https://football-league-simulator-six.vercel.app",
                "http://localhost:5173",
                "http://localhost:8081",
                "http://localhost:8082"
              )
              .AllowAnyMethod()
              .AllowAnyHeader()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || true)
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ⚠️ CRITICAL MIDDLEWARE ORDERING:
app.UseRouting();

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

        // Ensure Admins table exists (raw SQL backup for existing databases)
        var isPostgreSql = db.Database.ProviderName == "Npgsql.EntityFrameworkCore.PostgreSQL";
        string createTableSql = isPostgreSql 
            ? "CREATE TABLE IF NOT EXISTS \"Admins\" (\"Id\" SERIAL PRIMARY KEY, \"Username\" TEXT NOT NULL, \"PasswordHash\" TEXT NOT NULL);"
            : "CREATE TABLE IF NOT EXISTS \"Admins\" (\"Id\" INTEGER PRIMARY KEY AUTOINCREMENT, \"Username\" TEXT NOT NULL, \"PasswordHash\" TEXT NOT NULL);";
        db.Database.ExecuteSqlRaw(createTableSql);

        // Seed default admin if table is empty
        if (!db.Admins.Any())
        {
            db.Admins.Add(new Admin
            {
                Username = "admin",
                PasswordHash = PasswordHasher.HashPassword("admin123")
            });
            db.SaveChanges();
        }

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
