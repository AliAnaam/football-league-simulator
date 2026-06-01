using LigaSim.API.DTOs;

namespace LigaSim.API.Services.Interfaces;

public interface ISimulationService
{
    Task<SimulationResultDto> SimulateWeekAsync(int week);
    Task<SimulationResultDto> SimulateRemainingAsync();
    Task<List<StandingsRowDto>> GetStandingsAsync();
    Task<List<ScorerDto>> GetTopScorersAsync();
}
