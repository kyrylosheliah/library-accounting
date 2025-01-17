using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Appointment
{
    public int Id { get; set; }

    public int StaffId { get; set; }

    public DateTime Date { get; set; }

    public DateTime Created { get; set; }

    public DateTime Modified { get; set; }

    public string Text { get; set; } = null!;

    [JsonIgnore]
    public virtual User? Staff { get; set; }
}
