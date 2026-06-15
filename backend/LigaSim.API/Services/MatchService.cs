using LigaSim.API.DTOs;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class MatchService(
    IMatchRepository matchRepo,
    ITeamRepository teamRepo,
    IScorerRepository scorerRepo) : IMatchService
{
    public async Task<IEnumerable<MatchDto>> GetAllMatchesAsync()
    {
        var matches = await matchRepo.GetAllAsync();
        return matches.Select(MapToDto);
    }

    public async Task<IEnumerable<MatchDto>> GetMatchesByWeekAsync(int week)
    {
        var matches = await matchRepo.GetByWeekAsync(week);
        return matches.Select(MapToDto);
    }

    public async Task<int> GetCurrentWeekAsync()
    {
        var unplayed = await matchRepo.GetUnplayedAsync();
        var firstUnplayed = unplayed.FirstOrDefault();
        if (firstUnplayed is null)
        {
            var maxWeek = await matchRepo.GetMaxWeekAsync();
            return maxWeek == 0 ? 1 : maxWeek; // if all played, return maxWeek or 1
        }
        return firstUnplayed.WeekNumber;
    }

    public async Task<int> GetMaxWeeksAsync()
    {
        return await matchRepo.GetMaxWeekAsync();
    }

    public async Task GenerateFixturesAsync()
    {
        await matchRepo.DeleteAllAsync();
        await scorerRepo.ResetAllAsync();

        var teams = (await teamRepo.GetAllAsync()).ToList();
        if (teams.Count < 2) return;

        // Reset all team stats to start clean
        foreach (var t in teams)
        {
            t.Morale = 50;
            await teamRepo.UpdateAsync(t);
        }

        var teamIds = teams.Select(t => t.Id).ToList();
        
        // Shuffle teamIds to randomize matchups on every reset
        var rng = new Random();
        var shuffledTeamIds = teamIds.OrderBy(_ => rng.Next()).ToList();
        
        // Ensure even number of teams (dummy bye = -1)
        var tempIds = shuffledTeamIds.Count % 2 == 0 ? [.. shuffledTeamIds] : new List<int>([.. shuffledTeamIds, -1]);
        int n = tempIds.Count;
        int totalMatches = (int)Math.Ceiling(teams.Count / 2.0);

        var times = new[] { "21:00", "14:00", "16:15", "18:30", "21:00", "14:00", "16:15", "18:30", "21:00", "21:00" };

        var weeks = new List<List<Match>>();

        // First half: standard circle rotation
        for (int round = 0; round < n - 1; round++)
        {
            var weekMatches = new List<Match>();
            var rotated = new List<int> { tempIds[0] };
            var rest = tempIds.Skip(1).ToList();
            var rotatedRest = rest.Skip(round).Concat(rest.Take(round)).ToList();
            rotated.AddRange(rotatedRest);

            for (int i = 0; i < n / 2; i++)
            {
                int homeId = rotated[i];
                int awayId = rotated[n - 1 - i];

                if (homeId == -1 || awayId == -1) continue;

                string date;
                if (i == totalMatches - 1)
                {
                    date = "SAL";
                }
                else if (i == 0)
                {
                    date = "CUM";
                }
                else if (i >= 1 && i <= 3)
                {
                    date = "CMT";
                }
                else if (i >= 4 && i <= 7)
                {
                    date = "PAZ";
                }
                else
                {
                    date = "PZT";
                }

                string time = times[i % times.Length];

                weekMatches.Add(new Match
                {
                    WeekNumber = round + 1,
                    HomeTeamId = homeId,
                    AwayTeamId = awayId,
                    Played = false,
                    MatchDate = date,
                    MatchTime = time
                });
            }
            weeks.Add(weekMatches);
        }

        var allMatches = new List<Match>();
        foreach (var wm in weeks)
        {
            allMatches.AddRange(wm);
        }

        // Second half: reverse home/away
        for (int round = 0; round < n - 1; round++)
        {
            var returnWeekMatches = weeks[round].Select(m => new Match
            {
                WeekNumber = round + 1 + (n - 1),
                HomeTeamId = m.AwayTeamId,
                AwayTeamId = m.HomeTeamId,
                Played = false,
                MatchDate = m.MatchDate,
                MatchTime = m.MatchTime
            }).ToList();
            
            allMatches.AddRange(returnWeekMatches);
        }

        await matchRepo.BulkCreateAsync(allMatches);
    }

    public async Task ResetSeasonAsync()
    {
        // Reset all existing matches (clear scores, played = false)
        var matches = await matchRepo.GetAllAsync();
        foreach (var match in matches)
        {
            match.HomeScore = null;
            match.AwayScore = null;
            match.Played = false;
            await matchRepo.UpdateAsync(match);
        }

        // Reset scorers
        await scorerRepo.ResetAllAsync();

        // Reset all team stats and morale
        var teams = await teamRepo.GetAllAsync();
        foreach (var team in teams)
        {
            team.Morale = 50;
            await teamRepo.UpdateAsync(team);
        }
    }

    private static MatchDto MapToDto(Match match) =>
        new MatchDto(
            match.Id,
            match.WeekNumber,
            match.HomeTeamId,
            match.HomeTeam?.Name ?? "Home",
            match.HomeTeam?.ShortName ?? "H",
            match.HomeTeam?.LogoColor ?? "bg-slate-700 border-slate-500",
            match.HomeTeam?.LogoUrl,
            match.AwayTeamId,
            match.AwayTeam?.Name ?? "Away",
            match.AwayTeam?.ShortName ?? "A",
            match.AwayTeam?.LogoColor ?? "bg-slate-700 border-slate-500",
            match.AwayTeam?.LogoUrl,
            match.HomeScore,
            match.AwayScore,
            match.Played,
            match.MatchDate,
            match.MatchTime
        );
}
