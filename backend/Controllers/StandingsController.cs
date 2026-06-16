using Microsoft.AspNetCore.Mvc;
using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StandingsController(ISimulationService simService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<StandingsRowDto>>> GetStandings()
    {
        var standings = await simService.GetStandingsAsync();
        return Ok(standings);
    }

    [HttpGet("scorers")]
    public async Task<ActionResult<IEnumerable<ScorerDto>>> GetTopScorers()
    {
        var scorers = await simService.GetTopScorersAsync();
        return Ok(scorers);
    }
}
