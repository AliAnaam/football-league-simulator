using LigaSim.API.DTOs;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class SimulationService(
    IMatchRepository matchRepo,
    ITeamRepository teamRepo,
    IScorerRepository scorerRepo) : ISimulationService
{
    private static readonly Dictionary<string, List<string>> PlayerNames = new(StringComparer.OrdinalIgnoreCase)
    {
        { "RM", ["R. Benzema", "J. Bellingham", "Vinicius Jr.", "Rodrygo", "F. Valverde"] },
        { "BAR", ["R. Lewandowski", "Raphinha", "Lamine Yamal", "F. de Jong", "Pedri"] },
        { "ATM", ["A. Griezmann", "A. Morata", "Angel Correa", "R. De Paul", "Marcos Llorente"] },
        { "GIR", ["C. Stuani", "A. Dovbyk", "Viktor Tsygankov", "Yangel Herrera", "Savinho"] },
        { "ATH", ["I. Williams", "N. Williams", "O. Sancet", "G. Guruzeta", "Alex Berenguer"] },
        { "VIL", ["G. Moreno", "A. Sorloth", "Alex Baena", "Yeremy Pino", "Jose Morales"] },
        { "RSO", ["M. Oyarzabal", "Takefusa Kubo", "Brais Mendez", "Mikel Merino", "A. Barrenetxea"] },
        { "BET", ["Willian Jose", "Isco", "Ayoze Perez", "Nabil Fekir", "Pablo Fornals"] },
        { "LPA", ["Kirian Rodriguez", "Munir El Haddadi", "Sandro Ramirez", "Moleiro"] },
        { "RAY", ["Isi Palazon", "Alvaro Garcia", "R. de Tomas", "Oscar Trejo"] },
        { "OSA", ["Ante Budimir", "Chimy Avila", "Ruben Garcia", "Moi Gomez"] },
        { "SEV", ["Y. En-Nesyri", "Lucas Ocampos", "Dodi Lukebakio", "Suso"] },
        { "CEL", ["Iago Aspas", "Jorgen Strand Larsen", "Jonathan Bamba", "Fran Beltran"] },
        { "GET", ["Borja Mayoral", "Mason Greenwood", "Maksimovic", "Juan Latasa"] },
        { "VAL", ["Hugo Duro", "Javi Guerra", "Diego Lopez", "Pepelu"] },
        { "MAL", ["Vedat Muriqi", "Abdon Prats", "Cyle Larin", "Dani Rodriguez"] },
        { "CAD", ["Chris Ramos", "Darwin Machis", "Roger Marti", "Ruben Alcaraz"] },
        { "GRA", ["Myrto Uzuni", "Lucas Boye", "Bryan Zaragoza", "Gonzalo Villar"] }
    };

    public async Task<SimulationResultDto> SimulateWeekAsync(int week)
    {
        var matches = (await matchRepo.GetByWeekAsync(week)).ToList();
        var results = new List<MatchResultDto>();

        foreach (var match in matches)
        {
            if (match.Played) continue;

            var homeTeam = await teamRepo.GetByIdAsync(match.HomeTeamId);
            var awayTeam = await teamRepo.GetByIdAsync(match.AwayTeamId);

            if (homeTeam is null || awayTeam is null) continue;

            var score = SimulateMatch(homeTeam, awayTeam);
            match.HomeScore = score.homeScore;
            match.AwayScore = score.awayScore;
            match.Played = true;

            await matchRepo.UpdateAsync(match);

            // Update team morale based on result
            if (score.homeScore > score.awayScore)
            {
                await UpdateMorale(homeTeam, "win");
                await UpdateMorale(awayTeam, "loss");
            }
            else if (score.homeScore < score.awayScore)
            {
                await UpdateMorale(awayTeam, "win");
                await UpdateMorale(homeTeam, "loss");
            }
            else
            {
                await UpdateMorale(homeTeam, "draw");
                await UpdateMorale(awayTeam, "draw");
            }

            // Simulate Scorers
            await SimulateScorersForMatch(match, score.homeScore, score.awayScore);

            results.Add(new MatchResultDto(
                match.Id,
                homeTeam.Name,
                awayTeam.Name,
                score.homeScore,
                score.awayScore
            ));
        }

        var standings = await GetStandingsAsync();
        return new SimulationResultDto(week, results, standings);
    }

    public async Task<SimulationResultDto> SimulateRemainingAsync()
    {
        var unplayed = await matchRepo.GetUnplayedAsync();
        var unplayedList = unplayed.ToList();
        
        var results = new List<MatchResultDto>();
        int activeWeek = 1;

        if (unplayedList.Count > 0)
        {
            activeWeek = unplayedList[0].WeekNumber;
            foreach (var match in unplayedList)
            {
                var homeTeam = await teamRepo.GetByIdAsync(match.HomeTeamId);
                var awayTeam = await teamRepo.GetByIdAsync(match.AwayTeamId);

                if (homeTeam is null || awayTeam is null) continue;

                var score = SimulateMatch(homeTeam, awayTeam);
                match.HomeScore = score.homeScore;
                match.AwayScore = score.awayScore;
                match.Played = true;

                await matchRepo.UpdateAsync(match);

                // Update team morale based on result
                if (score.homeScore > score.awayScore)
                {
                    await UpdateMorale(homeTeam, "win");
                    await UpdateMorale(awayTeam, "loss");
                }
                else if (score.homeScore < score.awayScore)
                {
                    await UpdateMorale(awayTeam, "win");
                    await UpdateMorale(homeTeam, "loss");
                }
                else
                {
                    await UpdateMorale(homeTeam, "draw");
                    await UpdateMorale(awayTeam, "draw");
                }

                await SimulateScorersForMatch(match, score.homeScore, score.awayScore);

                results.Add(new MatchResultDto(
                    match.Id,
                    homeTeam.Name,
                    awayTeam.Name,
                    score.homeScore,
                    score.awayScore
                ));
            }
        }

        var standings = await GetStandingsAsync();
        return new SimulationResultDto(activeWeek, results, standings);
    }

    public async Task<List<StandingsRowDto>> GetStandingsAsync()
    {
        var teams = (await teamRepo.GetAllAsync()).ToList();
        var matches = (await matchRepo.GetPlayedMatchesAsync()).ToList();

        var rows = teams.Select(t => new StandingsRow
        {
            Team = t,
            Form = []
        }).ToDictionary(r => r.Team.Id);

        // Compute standings from played matches
        foreach (var m in matches)
        {
            if (!rows.TryGetValue(m.HomeTeamId, out var homeRow) ||
                !rows.TryGetValue(m.AwayTeamId, out var awayRow)) continue;

            homeRow.Played += 1;
            awayRow.Played += 1;

            homeRow.GoalsFor += m.HomeScore ?? 0;
            homeRow.GoalsAgainst += m.AwayScore ?? 0;

            awayRow.GoalsFor += m.AwayScore ?? 0;
            awayRow.GoalsAgainst += m.HomeScore ?? 0;

            if (m.HomeScore > m.AwayScore)
            {
                homeRow.Won += 1;
                awayRow.Lost += 1;
                homeRow.Form.Add("G");
                awayRow.Form.Add("M");
            }
            else if (m.HomeScore < m.AwayScore)
            {
                awayRow.Won += 1;
                homeRow.Lost += 1;
                homeRow.Form.Add("M");
                awayRow.Form.Add("G");
            }
            else
            {
                homeRow.Drawn += 1;
                awayRow.Drawn += 1;
                homeRow.Form.Add("B");
                awayRow.Form.Add("B");
            }
        }

        // Sort by: Points DESC, GoalDiff DESC, GoalsFor DESC, Name ASC
        var sortedRows = rows.Values
            .OrderByDescending(r => r.Points)
            .ThenByDescending(r => r.GoalDiff)
            .ThenByDescending(r => r.GoalsFor)
            .ThenBy(r => r.Team.Name)
            .ToList();

        var dtoList = new List<StandingsRowDto>();
        for (int i = 0; i < sortedRows.Count; i++)
        {
            var r = sortedRows[i];
            
            // Limit form to last 5 matches
            var last5Form = r.Form.TakeLast(5).ToList();

            dtoList.Add(new StandingsRowDto(
                i + 1,
                r.Team.Id,
                r.Team.Name,
                r.Team.ShortName,
                r.Team.LogoColor,
                r.Team.LogoUrl,
                r.Played,
                r.Won,
                r.Drawn,
                r.Lost,
                r.GoalsFor,
                r.GoalsAgainst,
                r.GoalDiff,
                r.Points,
                last5Form,
                r.Team.Morale
            ));
        }

        return dtoList;
    }

    public async Task<List<ScorerDto>> GetTopScorersAsync()
    {
        var scorers = await scorerRepo.GetAllAsync();
        return scorers.Take(15).Select(s => new ScorerDto(
            s.Name,
            s.TeamId,
            s.Team?.Name ?? "Bilinmeyen",
            s.Team?.ShortName ?? "B",
            s.Goals
        )).ToList();
    }

    // ─── Private Simulation Helpers ──────────────────────────────────────────

    private static (int homeScore, int awayScore) SimulateMatch(Team homeTeam, Team awayTeam)
    {
        int homeAdvantage = 3;
        int moraleHome = GetMoraleBonus(homeTeam);
        int moraleAway = GetMoraleBonus(awayTeam);

        int rawPowerHome = homeTeam.Power + homeAdvantage + moraleHome;
        int rawPowerAway = awayTeam.Power + moraleAway;

        double powerDiff = rawPowerHome - rawPowerAway;

        // Base expected goals with power difference scaling (stronger team gets higher win probability)
        double homeExpected = 1.3 + (powerDiff * 0.05) + Random.Shared.NextDouble() * 0.4;
        double awayExpected = 1.1 - (powerDiff * 0.05) + Random.Shared.NextDouble() * 0.4;

        // Calculate scores with moderate variance centered around the expectation
        int homeScore = (int)Math.Round(homeExpected + (Random.Shared.NextDouble() - 0.5) * 1.2);
        int awayScore = (int)Math.Round(awayExpected + (Random.Shared.NextDouble() - 0.5) * 1.2);

        // Ensure scores are non-negative and cap at a realistic max
        homeScore = Math.Clamp(homeScore, 0, 6);
        awayScore = Math.Clamp(awayScore, 0, 6);

        return (homeScore, awayScore);
    }

    private static int GetMoraleBonus(Team team)
    {
        // Morale 50 = neutral, 100 = +2.5 (+2 in round), 0 = -2.5 (-2 in round)
        return (int)Math.Round((team.Morale - 50) / 20.0);
    }

    private async Task UpdateMorale(Team team, string result)
    {
        if (result == "win") team.Morale = Math.Min(100, team.Morale + 10);
        else if (result == "draw") team.Morale = Math.Min(100, team.Morale + 2);
        else if (result == "loss") team.Morale = Math.Max(0, team.Morale - 8);

        await teamRepo.UpdateAsync(team);
    }

    private async Task SimulateScorersForMatch(Match match, int homeScore, int awayScore)
    {
        // Home Scorers
        for (int i = 0; i < homeScore; i++)
        {
            string name = GetRandomPlayer(match.HomeTeam?.ShortName ?? "RM");
            await scorerRepo.AddGoalAsync(name, match.HomeTeamId);
        }

        // Away Scorers
        for (int i = 0; i < awayScore; i++)
        {
            string name = GetRandomPlayer(match.AwayTeam?.ShortName ?? "BAR");
            await scorerRepo.AddGoalAsync(name, match.AwayTeamId);
        }
    }

    private static string GetRandomPlayer(string teamShortName)
    {
        if (PlayerNames.TryGetValue(teamShortName, out var players) && players.Count > 0)
        {
            return players[Random.Shared.Next(players.Count)];
        }
        return "Oyuncu " + Random.Shared.Next(1, 11);
    }
}
