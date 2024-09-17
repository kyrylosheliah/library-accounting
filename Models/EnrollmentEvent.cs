using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class EnrollmentEvent
{
    public int Id { get; set; }

    public string Event { get; set; } = null!;

    [JsonIgnore]
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();
}
