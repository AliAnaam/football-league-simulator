using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;

namespace LigaSim.API.Repositories;

public class ScorerRepository(LigaSimDbContext db) : IScorerRepository
{
    public async Task<IEnumerable<Scorer>> GetAllAsync() =>
        await db.Scorers.Include(s => s.Team).OrderByDescending(s => s.Goals).ToListAsync();

    public async Task AddGoalAsync(string name, int teamId)
    {
        var existing = await db.Scorers.FirstOrDefaultAsync(s => s.Name == name && s.TeamId == teamId);
        if (existing is not null)
        {
            existing.Goals += 1;
            db.Scorers.Update(existing);
        }
        else
        {
            var scorer = new Scorer { Name = name, TeamId = teamId, Goals = 1 };
            db.Scorers.Add(scorer);
        }
        await db.SaveChangesAsync();
    }

    public async Task ResetAllAsync()
    {
        db.Scorers.RemoveRange(db.Scorers);
        await db.SaveChangesAsync();
    }
}
