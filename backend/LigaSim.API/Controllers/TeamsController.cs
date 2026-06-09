using Microsoft.AspNetCore.Mvc;
using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class TeamsController(ITeamService teamService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<TeamDto>>> GetAll()
    {
        var teams = await teamService.GetAllTeamsAsync();
        return Ok(teams);
    }

    [HttpGet("{id:int}")]
    public async Task<ActionResult<TeamDto>> GetById(int id)
    {
        var team = await teamService.GetTeamByIdAsync(id);
        if (team is null) return NotFound(new { message = $"Team with ID {id} not found." });
        return Ok(team);
    }

    [HttpPost]
    public async Task<ActionResult<TeamDto>> Create(CreateTeamDto dto)
    {
        try
        {
            var created = await teamService.CreateTeamAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpPut("{id:int}")]
    public async Task<ActionResult<TeamDto>> Update(int id, UpdateTeamDto dto)
    {
        try
        {
            var updated = await teamService.UpdateTeamAsync(id, dto);
            if (updated is null) return NotFound(new { message = $"Team with ID {id} not found." });
            return Ok(updated);
        }
        catch (System.ArgumentException ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var deleted = await teamService.DeleteTeamAsync(id);
        if (!deleted) return NotFound(new { message = $"Team with ID {id} not found." });
        return NoContent();
    }
}
