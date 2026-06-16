namespace LigaSim.API.Models;

public class Team
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string ShortName { get; set; } = string.Empty;
    public int FoundingYear { get; set; }
    public string PrimaryColor { get; set; } = "#10b981";
    public string? LogoUrl { get; set; }
    public int Power { get; set; } = 75;
    public int Morale { get; set; } = 50;
    public string Manager { get; set; } = string.Empty;
    public string Stadium { get; set; } = string.Empty;
    public string Capacity { get; set; } = string.Empty;
    public string LogoColor { get; set; } = "bg-slate-700 border-slate-500";

    // Navigation: matches where this team is home or away
    public ICollection<Match> HomeMatches { get; set; } = [];
    public ICollection<Match> AwayMatches { get; set; } = [];
}
