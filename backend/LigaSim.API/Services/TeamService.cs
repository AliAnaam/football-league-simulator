using LigaSim.API.DTOs;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class TeamService(ITeamRepository teamRepo) : ITeamService
{
    public async Task<IEnumerable<TeamDto>> GetAllTeamsAsync()
    {
        var teams = await teamRepo.GetAllAsync();
        return teams.Select(MapToDto);
    }

    public async Task<TeamDto?> GetTeamByIdAsync(int id)
    {
        var team = await teamRepo.GetByIdAsync(id);
        return team is null ? null : MapToDto(team);
    }

    public async Task<TeamDto> CreateTeamAsync(CreateTeamDto dto)
    {
        // Simple mapping from hex code to some tailwind classes for the logo color
        string logoColor = GetLogoColorFromHex(dto.PrimaryColor);

        var team = new Team
        {
            Name = dto.Name,
            ShortName = dto.ShortName,
            FoundingYear = dto.FoundingYear,
            PrimaryColor = dto.PrimaryColor,
            LogoUrl = dto.LogoUrl,
            Power = dto.Power,
            Morale = 50, // default morale
            Manager = dto.Manager,
            Stadium = dto.Stadium,
            Capacity = dto.Capacity,
            LogoColor = logoColor
        };

        var created = await teamRepo.CreateAsync(team);
        return MapToDto(created);
    }

    public async Task<TeamDto?> UpdateTeamAsync(int id, UpdateTeamDto dto)
    {
        var team = await teamRepo.GetByIdAsync(id);
        if (team is null) return null;

        team.Name = dto.Name;
        team.ShortName = dto.ShortName;
        team.FoundingYear = dto.FoundingYear;
        team.PrimaryColor = dto.PrimaryColor;
        team.LogoUrl = dto.LogoUrl;
        team.Power = dto.Power;
        team.Manager = dto.Manager;
        team.Stadium = dto.Stadium;
        team.Capacity = dto.Capacity;
        team.LogoColor = GetLogoColorFromHex(dto.PrimaryColor);

        var updated = await teamRepo.UpdateAsync(team);
        return MapToDto(updated);
    }

    public async Task<bool> DeleteTeamAsync(int id)
    {
        return await teamRepo.DeleteAsync(id);
    }

    private static TeamDto MapToDto(Team team) =>
        new TeamDto(
            team.Id,
            team.Name,
            team.ShortName,
            team.FoundingYear,
            team.PrimaryColor,
            team.LogoUrl,
            team.Power,
            team.Morale,
            team.Manager,
            team.Stadium,
            team.Capacity,
            team.LogoColor
        );

    private static string GetLogoColorFromHex(string hex)
    {
        // Generate a tailwind border/bg class combo based on hex color for pre-styled assets
        return "bg-slate-800 border-emerald-500"; 
    }
}
