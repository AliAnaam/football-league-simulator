namespace LigaSim.API.Models;

public class Scorer
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public int TeamId { get; set; }
    public Team Team { get; set; } = null!;
    public int Goals { get; set; }
}
