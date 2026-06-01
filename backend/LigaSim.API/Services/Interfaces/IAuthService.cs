using LigaSim.API.DTOs;

namespace LigaSim.API.Services.Interfaces;

public interface IAuthService
{
    Task<LoginResponseDto> LoginAsync(LoginDto loginDto);
}
