using LigaSim.API.DTOs;

namespace LigaSim.API.Services.Interfaces;

public interface ITeamService
{
    Task<IEnumerable<TeamDto>> GetAllTeamsAsync();
    Task<TeamDto?> GetTeamByIdAsync(int id);
    Task<TeamDto> CreateTeamAsync(CreateTeamDto dto);
    Task<TeamDto?> UpdateTeamAsync(int id, UpdateTeamDto dto);
    Task<bool> DeleteTeamAsync(int id);
}
