namespace LigaSim.API.Models;

/// <summary>
/// Represents an aggregated standings row - computed, not stored separately.
/// </summary>
public class StandingsRow
{
    public int Rank { get; set; }
    public Team Team { get; set; } = null!;
    public int Played { get; set; }
    public int Won { get; set; }
    public int Drawn { get; set; }
    public int Lost { get; set; }
    public int GoalsFor { get; set; }
    public int GoalsAgainst { get; set; }
    public int GoalDiff => GoalsFor - GoalsAgainst;
    public int Points => (Won * 3) + Drawn;
    public List<string> Form { get; set; } = [];
}
