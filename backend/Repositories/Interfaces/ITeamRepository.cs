using LigaSim.API.Models;

namespace LigaSim.API.Repositories.Interfaces;

public interface ITeamRepository
{
    Task<IEnumerable<Team>> GetAllAsync();
    Task<Team?> GetByIdAsync(int id);
    Task<Team> CreateAsync(Team team);
    Task<Team> UpdateAsync(Team team);
    Task<bool> DeleteAsync(int id);
    Task<bool> ExistsAsync(int id);
}
