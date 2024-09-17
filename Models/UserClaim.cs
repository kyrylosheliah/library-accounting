using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class UserClaim
{
    public int Id { get; set; }

    public int UserId { get; set; }

    public string Type { get; set; } = null!;

    public string Value { get; set; } = null!;

    [JsonIgnore]
    public virtual User? User { get; set; }
}
