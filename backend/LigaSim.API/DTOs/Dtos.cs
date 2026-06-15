namespace LigaSim.API.DTOs;

// ─── Team DTOs ───────────────────────────────────────────────────────────────

public record TeamDto(
    int Id,
    string Name,
    string ShortName,
    int FoundingYear,
    string PrimaryColor,
    string? LogoUrl,
    int Power,
    int Morale,
    string Manager,
    string Stadium,
    string Capacity,
    string LogoColor
);

public record CreateTeamDto(
    string Name,
    string ShortName,
    int FoundingYear,
    string PrimaryColor,
    string? LogoUrl,
    int Power,
    string Manager,
    string Stadium,
    string Capacity
);

public record UpdateTeamDto(
    string Name,
    string ShortName,
    int FoundingYear,
    string PrimaryColor,
    string? LogoUrl,
    int Power,
    string Manager,
    string Stadium,
    string Capacity
);

// ─── Match DTOs ───────────────────────────────────────────────────────────────

public record MatchDto(
    int Id,
    int WeekNumber,
    int HomeTeamId,
    string HomeTeamName,
    string HomeTeamShortName,
    string HomeLogoColor,
    string? HomeLogoUrl,
    int AwayTeamId,
    string AwayTeamName,
    string AwayTeamShortName,
    string AwayLogoColor,
    string? AwayLogoUrl,
    int? HomeScore,
    int? AwayScore,
    bool Played,
    string MatchDate,
    string MatchTime
);

// ─── Standings DTOs ───────────────────────────────────────────────────────────

public record StandingsRowDto(
    int Rank,
    int TeamId,
    string TeamName,
    string TeamShortName,
    string LogoColor,
    string? LogoUrl,
    int Played,
    int Won,
    int Drawn,
    int Lost,
    int GoalsFor,
    int GoalsAgainst,
    int GoalDiff,
    int Points,
    List<string> Form,
    int Morale
);

// ─── Simulation DTOs ─────────────────────────────────────────────────────────

public record SimulationResultDto(
    int Week,
    List<MatchResultDto> Results,
    List<StandingsRowDto> UpdatedStandings
);

public record MatchResultDto(
    int MatchId,
    string HomeTeam,
    string AwayTeam,
    int HomeScore,
    int AwayScore
);

// ─── Auth DTOs ────────────────────────────────────────────────────────────────

public record LoginDto(string Username, string Password);
public record RegisterDto(string Username, string Password);
public record LoginResponseDto(bool Success, string Message);

// ─── Scorer DTOs ──────────────────────────────────────────────────────────────
public record ScorerDto(string Name, int TeamId, string TeamName, string TeamShortName, int Goals);

