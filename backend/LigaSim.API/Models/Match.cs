namespace LigaSim.API.Models;

public class Match
{
    public int Id { get; set; }
    public int WeekNumber { get; set; }
    public int HomeTeamId { get; set; }
    public int AwayTeamId { get; set; }
    public int? HomeScore { get; set; }
    public int? AwayScore { get; set; }
    public bool Played { get; set; }
    public string MatchDate { get; set; } = string.Empty;
    public string MatchTime { get; set; } = string.Empty;

    // Navigation properties
    public Team HomeTeam { get; set; } = null!;
    public Team AwayTeam { get; set; } = null!;
}
