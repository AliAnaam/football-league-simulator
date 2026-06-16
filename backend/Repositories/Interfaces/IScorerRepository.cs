using LigaSim.API.Models;

namespace LigaSim.API.Repositories.Interfaces;

public interface IScorerRepository
{
    Task<IEnumerable<Scorer>> GetAllAsync();
    Task AddGoalAsync(string name, int teamId);
    Task ResetAllAsync();
}
