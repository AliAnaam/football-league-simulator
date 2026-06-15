using Microsoft.EntityFrameworkCore;
using LigaSim.API.Data;
using LigaSim.API.DTOs;
using LigaSim.API.Models;
using LigaSim.API.Services.Interfaces;

namespace LigaSim.API.Services;

public class AuthService(LigaSimDbContext dbContext) : IAuthService
{
    public async Task<LoginResponseDto> LoginAsync(LoginDto loginDto)
    {
        var admin = await dbContext.Admins.FirstOrDefaultAsync(a => a.Username == loginDto.Username);
        if (admin != null && PasswordHasher.VerifyPassword(loginDto.Password, admin.PasswordHash))
        {
            return new LoginResponseDto(true, "Giriş başarılı!");
        }
        
        return new LoginResponseDto(false, "Geçersiz kullanıcı adı veya şifre!");
    }

    public async Task<LoginResponseDto> RegisterAsync(RegisterDto registerDto)
    {
        var existing = await dbContext.Admins.FirstOrDefaultAsync(a => a.Username == registerDto.Username);
        if (existing != null)
        {
            return new LoginResponseDto(false, "Bu kullanıcı adı zaten alınmış!");
        }

        var newAdmin = new Admin
        {
            Username = registerDto.Username,
            PasswordHash = PasswordHasher.HashPassword(registerDto.Password)
        };

        dbContext.Admins.Add(newAdmin);
        await dbContext.SaveChangesAsync();

        return new LoginResponseDto(true, "Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
    }
}
