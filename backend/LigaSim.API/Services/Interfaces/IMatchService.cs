using LigaSim.API.DTOs;

namespace LigaSim.API.Services.Interfaces;

public interface IMatchService
{
    Task<IEnumerable<MatchDto>> GetAllMatchesAsync();
    Task<IEnumerable<MatchDto>> GetMatchesByWeekAsync(int week);
    Task<int> GetCurrentWeekAsync();
    Task<int> GetMaxWeeksAsync();
    Task GenerateFixturesAsync();
    Task ResetSeasonAsync();
}
