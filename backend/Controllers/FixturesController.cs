using Microsoft.AspNetCore.Mvc;
using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FixturesController(IMatchService matchService) : ControllerBase
{
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MatchDto>>> GetAll()
    {
        var matches = await matchService.GetAllMatchesAsync();
        return Ok(matches);
    }

    [HttpGet("week/{week:int}")]
    public async Task<ActionResult<IEnumerable<MatchDto>>> GetByWeek(int week)
    {
        var matches = await matchService.GetMatchesByWeekAsync(week);
        return Ok(matches);
    }

    [HttpGet("current-week")]
    public async Task<ActionResult<int>> GetCurrentWeek()
    {
        int week = await matchService.GetCurrentWeekAsync();
        return Ok(week);
    }

    [HttpGet("max-week")]
    public async Task<ActionResult<int>> GetMaxWeek()
    {
        int week = await matchService.GetMaxWeeksAsync();
        return Ok(week);
    }

    [HttpPost("generate")]
    public async Task<IActionResult> Generate()
    {
        await matchService.GenerateFixturesAsync();
        return Ok(new { message = "Fikstür başarıyla oluşturuldu." });
    }

    [HttpPost("reset")]
    public async Task<IActionResult> Reset()
    {
        await matchService.ResetSeasonAsync();
        return Ok(new { message = "Sezon başarıyla sıfırlandı." });
    }
}
