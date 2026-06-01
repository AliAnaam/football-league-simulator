using LigaSim.API.DTOs;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class AuthService : IAuthService
{
    public Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
    {
        if (loginDto.Username == "admin" && loginDto.Password == "admin123")
        {
            return Task.FromResult(new LoginResponseDto(true, "Giriş başarılı!"));
        }
        
        return Task.FromResult(new LoginResponseDto(false, "Geçersiz kullanıcı adı veya şifre!"));
    }
}
