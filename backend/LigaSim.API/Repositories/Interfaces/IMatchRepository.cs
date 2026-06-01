using LigaSim.API.Models;

namespace LigaSim.API.Repositories.Interfaces;

public interface IMatchRepository
{
    Task<IEnumerable<Match>> GetAllAsync();
    Task<IEnumerable<Match>> GetByWeekAsync(int week);
    Task<IEnumerable<Match>> GetUnplayedAsync();
    Task<Match?> GetByIdAsync(int id);
    Task BulkCreateAsync(IEnumerable<Match> matches);
    Task UpdateAsync(Match match);
    Task DeleteAllAsync();
    Task<int> GetMaxWeekAsync();
    Task<IEnumerable<Match>> GetPlayedMatchesAsync();
}
