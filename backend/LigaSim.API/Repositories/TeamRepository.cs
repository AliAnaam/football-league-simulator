using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;

namespace LigaSim.API.Repositories;

public class TeamRepository(LigaSimDbContext db) : ITeamRepository
{
    public async Task<IEnumerable<Team>> GetAllAsync() =>
        await db.Teams.OrderBy(t => t.Name).ToListAsync();

    public async Task<Team?> GetByIdAsync(int id) =>
        await db.Teams.FindAsync(id);

    public async Task<Team> CreateAsync(Team team)
    {
        db.Teams.Add(team);
        await db.SaveChangesAsync();
        return team;
    }

    public async Task<Team> UpdateAsync(Team team)
    {
        db.Teams.Update(team);
        await db.SaveChangesAsync();
        return team;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var team = await db.Teams.FindAsync(id);
        if (team is null) return false;
        db.Teams.Remove(team);
        await db.SaveChangesAsync();
        return true;
    }

    public async Task<bool> ExistsAsync(int id) =>
        await db.Teams.AnyAsync(t => t.Id == id);
}
