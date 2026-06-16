using Microsoft.AspNetCore.Mvc;
using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController(IAuthService authService) : ControllerBase
{
    [HttpPost("login")]
    public async Task<ActionResult<LoginResponseDto>> Login(LoginDto loginDto)
    {
        var response = await authService.LoginAsync(loginDto);
        if (!response.Success)
        {
            return Unauthorized(response);
        }
        return Ok(response);
    }

    [HttpPost("register")]
    public async Task<ActionResult<LoginResponseDto>> Register(RegisterDto registerDto)
    {
        var response = await authService.RegisterAsync(registerDto);
        if (!response.Success)
        {
            return BadRequest(response);
        }
        return Ok(response);
    }
}
