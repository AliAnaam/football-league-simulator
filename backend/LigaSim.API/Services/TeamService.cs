using LigaSim.API.DTOs;
using LigaSim.API.Models;
using LigaSim.API.Repositories.Interfaces;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class TeamService(
    ITeamRepository teamRepo,
    IMatchRepository matchRepo,
    IScorerRepository scorerRepo,
    IMatchService matchService) : ITeamService
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
        string nameTrimmed = dto.Name.Trim();
        string shortNameTrimmed = dto.ShortName.Trim();

        if (string.IsNullOrWhiteSpace(nameTrimmed))
        {
            throw new ArgumentException("Takım adı boş olamaz.");
        }
        if (string.IsNullOrWhiteSpace(shortNameTrimmed))
        {
            throw new ArgumentException("Takım kısaltması boş olamaz.");
        }

        var teams = await teamRepo.GetAllAsync();
        if (teams.Any(t => t.Name.Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException($"'{nameTrimmed}' isimli bir takım zaten mevcut.");
        }
        if (teams.Any(t => t.ShortName.Trim().Equals(shortNameTrimmed, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException($"'{shortNameTrimmed}' kısaltmalı bir takım zaten mevcut.");
        }

        // Simple mapping from hex code to some tailwind classes for the logo color
        string logoColor = GetLogoColorFromHex(dto.PrimaryColor);

        var team = new Team
        {
            Name = nameTrimmed,
            ShortName = shortNameTrimmed,
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

        string nameTrimmed = dto.Name.Trim();
        string shortNameTrimmed = dto.ShortName.Trim();

        if (string.IsNullOrWhiteSpace(nameTrimmed))
        {
            throw new ArgumentException("Takım adı boş olamaz.");
        }
        if (string.IsNullOrWhiteSpace(shortNameTrimmed))
        {
            throw new ArgumentException("Takım kısaltması boş olamaz.");
        }

        var teams = await teamRepo.GetAllAsync();
        if (teams.Any(t => t.Id != id && t.Name.Trim().Equals(nameTrimmed, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException($"'{nameTrimmed}' isimli bir takım zaten mevcut.");
        }
        if (teams.Any(t => t.Id != id && t.ShortName.Trim().Equals(shortNameTrimmed, StringComparison.OrdinalIgnoreCase)))
        {
            throw new ArgumentException($"'{shortNameTrimmed}' kısaltmalı bir takım zaten mevcut.");
        }

        team.Name = nameTrimmed;
        team.ShortName = shortNameTrimmed;
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
        // 1. Delete all matches and scorers first (to avoid foreign key constraint violations)
        await matchRepo.DeleteAllAsync();
        await scorerRepo.ResetAllAsync();

        // 2. Delete the team
        var deleted = await teamRepo.DeleteAsync(id);
        if (!deleted) return false;

        // 3. Reset stats for remaining teams
        var teams = await teamRepo.GetAllAsync();
        foreach (var t in teams)
        {
            t.Morale = 50;
            await teamRepo.UpdateAsync(t);
        }

        // 4. Generate new fixtures for the remaining teams
        await matchService.GenerateFixturesAsync();
        return true;
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
