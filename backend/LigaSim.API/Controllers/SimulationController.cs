using Microsoft.AspNetCore.Mvc;
using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SimulationController(ISimulationService simService) : ControllerBase
{
    [HttpPost("week/{week:int}")]
    public async Task<ActionResult<SimulationResultDto>> SimulateWeek(int week)
    {
        var result = await simService.SimulateWeekAsync(week);
        return Ok(result);
    }

    [HttpPost("remaining")]
    public async Task<ActionResult<SimulationResultDto>> SimulateRemaining()
    {
        var result = await simService.SimulateRemainingAsync();
        return Ok(result);
    }
}
