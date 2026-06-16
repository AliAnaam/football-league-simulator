using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;

namespace LigaSim.API.Repositories;

public class MatchRepository(LigaSimDbContext db) : IMatchRepository
{
    private IQueryable<Match> WithTeams => db.Matches
        .Include(m => m.HomeTeam)
        .Include(m => m.AwayTeam);

    public async Task<IEnumerable<Match>> GetAllAsync() =>
        await WithTeams.OrderBy(m => m.WeekNumber).ThenBy(m => m.Id).ToListAsync();

    public async Task<IEnumerable<Match>> GetByWeekAsync(int week) =>
        await WithTeams.Where(m => m.WeekNumber == week).ToListAsync();

    public async Task<IEnumerable<Match>> GetUnplayedAsync() =>
        await WithTeams.Where(m => !m.Played).OrderBy(m => m.WeekNumber).ToListAsync();

    public async Task<Match?> GetByIdAsync(int id) =>
        await WithTeams.FirstOrDefaultAsync(m => m.Id == id);

    public async Task BulkCreateAsync(IEnumerable<Match> matches)
    {
        await db.Matches.AddRangeAsync(matches);
        await db.SaveChangesAsync();
    }

    public async Task UpdateAsync(Match match)
    {
        db.Matches.Update(match);
        await db.SaveChangesAsync();
    }

    public async Task DeleteAllAsync()
    {
        db.Matches.RemoveRange(db.Matches);
        await db.SaveChangesAsync();
    }

    public async Task<int> GetMaxWeekAsync() =>
        await db.Matches.AnyAsync() ? await db.Matches.MaxAsync(m => m.WeekNumber) : 0;

    public async Task<IEnumerable<Match>> GetPlayedMatchesAsync() =>
        await WithTeams.Where(m => m.Played).ToListAsync();
}
