using Microsoft.EntityFrameworkCore;
using LigaSim.API.Models;

namespace LigaSim.API.Data;

public class LigaSimDbContext(DbContextOptions<LigaSimDbContext> options) : DbContext(options)
{
    public DbSet<Team> Teams => Set<Team>();
    public DbSet<Match> Matches => Set<Match>();
    public DbSet<Scorer> Scorers => Set<Scorer>();
    public DbSet<Admin> Admins => Set<Admin>();


    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Match → HomeTeam (restrict delete to avoid cascade conflict)
        modelBuilder.Entity<Match>()
            .HasOne(m => m.HomeTeam)
            .WithMany(t => t.HomeMatches)
            .HasForeignKey(m => m.HomeTeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // Match → AwayTeam
        modelBuilder.Entity<Match>()
            .HasOne(m => m.AwayTeam)
            .WithMany(t => t.AwayMatches)
            .HasForeignKey(m => m.AwayTeamId)
            .OnDelete(DeleteBehavior.Restrict);

        // ─── Seed: 18 LaLiga Teams ─────────────────────────────────────────
        modelBuilder.Entity<Team>().HasData(
            new Team { Id = 1,  Name = "Real Madrid",    ShortName = "RM",  FoundingYear = 1902, PrimaryColor = "#1e3a5f", Power = 95, Morale = 75, Manager = "Carlo Ancelotti",    Stadium = "Santiago Bernabéu",      Capacity = "85,000",  LogoColor = "bg-indigo-900 border-indigo-700", LogoUrl = "https://crests.football-data.org/86.svg" },
            new Team { Id = 2,  Name = "Barcelona",      ShortName = "BAR", FoundingYear = 1899, PrimaryColor = "#a80532", Power = 93, Morale = 70, Manager = "Hansi Flick",         Stadium = "Spotify Camp Nou",       Capacity = "99,354",  LogoColor = "bg-red-800 border-blue-900",       LogoUrl = "https://crests.football-data.org/81.svg" },
            new Team { Id = 3,  Name = "Atletico Madrid", ShortName = "ATM", FoundingYear = 1903, PrimaryColor = "#ce1b2b", Power = 90, Morale = 65, Manager = "Diego Simeone",       Stadium = "Cívitas Metropolitano",  Capacity = "70,460",  LogoColor = "bg-red-600 border-blue-700",       LogoUrl = "https://crests.football-data.org/78.svg" },
            new Team { Id = 4,  Name = "Girona",         ShortName = "GIR", FoundingYear = 1930, PrimaryColor = "#c8102e", Power = 84, Morale = 60, Manager = "Míchel",              Stadium = "Montilivi",              Capacity = "14,624",  LogoColor = "bg-red-500 border-red-400",        LogoUrl = "https://crests.football-data.org/298.svg" },
            new Team { Id = 5,  Name = "Athletic Club",  ShortName = "ATH", FoundingYear = 1898, PrimaryColor = "#ee2423", Power = 85, Morale = 62, Manager = "Ernesto Valverde",   Stadium = "San Mamés",              Capacity = "53,289",  LogoColor = "bg-red-700 border-slate-200",      LogoUrl = "https://crests.football-data.org/77.svg" },
            new Team { Id = 6,  Name = "Villarreal",     ShortName = "VIL", FoundingYear = 1923, PrimaryColor = "#fcbe00", Power = 83, Morale = 58, Manager = "Marcelino",           Stadium = "Estadio de la Cerámica", Capacity = "23,000",  LogoColor = "bg-yellow-400 border-yellow-300",  LogoUrl = "https://crests.football-data.org/94.svg" },
            new Team { Id = 7,  Name = "Real Sociedad",  ShortName = "RSO", FoundingYear = 1909, PrimaryColor = "#1a4e9c", Power = 84, Morale = 60, Manager = "Imanol Alguacil",    Stadium = "Reale Arena",            Capacity = "39,500",  LogoColor = "bg-blue-600 border-slate-200",     LogoUrl = "https://crests.football-data.org/92.svg" },
            new Team { Id = 8,  Name = "Betis",          ShortName = "BET", FoundingYear = 1907, PrimaryColor = "#00954c", Power = 82, Morale = 55, Manager = "Manuel Pellegrini",  Stadium = "Benito Villamarín",      Capacity = "60,720",  LogoColor = "bg-emerald-700 border-slate-200",  LogoUrl = "https://crests.football-data.org/90.svg" },
            new Team { Id = 9,  Name = "Las Palmas",     ShortName = "LPA", FoundingYear = 1949, PrimaryColor = "#f5a800", Power = 76, Morale = 50, Manager = "Luis Carrión",        Stadium = "Gran Canaria",           Capacity = "32,400",  LogoColor = "bg-yellow-500 border-blue-600",    LogoUrl = "https://crests.football-data.org/275.svg" },
            new Team { Id = 10, Name = "Rayo Vallecano", ShortName = "RAY", FoundingYear = 1924, PrimaryColor = "#e60026", Power = 75, Morale = 50, Manager = "Íñigo Pérez",         Stadium = "Vallecas",               Capacity = "14,700",  LogoColor = "bg-slate-100 border-red-500",      LogoUrl = "https://crests.football-data.org/87.svg" },
            new Team { Id = 11, Name = "Osasuna",        ShortName = "OSA", FoundingYear = 1920, PrimaryColor = "#6b0000", Power = 78, Morale = 52, Manager = "Vicente Moreno",      Stadium = "El Sadar",               Capacity = "23,576",  LogoColor = "bg-red-900 border-slate-300",      LogoUrl = "https://crests.football-data.org/79.svg" },
            new Team { Id = 12, Name = "Sevilla",        ShortName = "SEV", FoundingYear = 1890, PrimaryColor = "#d81920", Power = 80, Morale = 48, Manager = "García Pimienta",     Stadium = "Ramón Sánchez-Pizjuán",  Capacity = "43,883",  LogoColor = "bg-red-700 border-slate-200",      LogoUrl = "https://crests.football-data.org/559.svg" },
            new Team { Id = 13, Name = "Celta Vigo",     ShortName = "CEL", FoundingYear = 1923, PrimaryColor = "#8ecae6", Power = 75, Morale = 45, Manager = "Claudio Giráldez",   Stadium = "Abanca-Balaídos",        Capacity = "29,000",  LogoColor = "bg-sky-400 border-slate-200",      LogoUrl = "https://crests.football-data.org/558.svg" },
            new Team { Id = 14, Name = "Getafe",         ShortName = "GET", FoundingYear = 1946, PrimaryColor = "#003d7e", Power = 77, Morale = 48, Manager = "José Bordalás",       Stadium = "Coliseum",               Capacity = "16,500",  LogoColor = "bg-blue-800 border-blue-600",      LogoUrl = "https://crests.football-data.org/82.svg" },
            new Team { Id = 15, Name = "Valencia",       ShortName = "VAL", FoundingYear = 1919, PrimaryColor = "#d4a017", Power = 79, Morale = 40, Manager = "Rubén Baraja",        Stadium = "Mestalla",               Capacity = "49,430",  LogoColor = "bg-slate-200 border-slate-400",    LogoUrl = "https://crests.football-data.org/95.svg" },
            new Team { Id = 16, Name = "Mallorca",       ShortName = "MAL", FoundingYear = 1916, PrimaryColor = "#c8102e", Power = 74, Morale = 38, Manager = "Jagoba Arrasate",     Stadium = "Son Moix",               Capacity = "23,142",  LogoColor = "bg-red-600 border-black",          LogoUrl = "https://crests.football-data.org/89.svg" },
            new Team { Id = 17, Name = "Cadiz",          ShortName = "CAD", FoundingYear = 1910, PrimaryColor = "#f5d800", Power = 70, Morale = 35, Manager = "Paco López",          Stadium = "Nuevo Mirandilla",       Capacity = "20,724",  LogoColor = "bg-yellow-400 border-blue-800",    LogoUrl = "https://crests.football-data.org/264.svg" },
            new Team { Id = 18, Name = "Granada",        ShortName = "GRA", FoundingYear = 1931, PrimaryColor = "#c8102e", Power = 68, Morale = 30, Manager = "Guillermo Abascal",  Stadium = "Nuevo Los Cármenes",     Capacity = "19,336",  LogoColor = "bg-red-600 border-slate-200",      LogoUrl = "https://crests.football-data.org/84.svg" }
        );
    }
}
