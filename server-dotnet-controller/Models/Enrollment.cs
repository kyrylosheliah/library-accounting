using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Enrollment
{
    public int Id { get; set; }

    public int StaffId { get; set; }

    public int EventId { get; set; }

    public DateTime EventDate { get; set; }

    [JsonIgnore]
    public virtual EnrollmentEvent? Event { get; set; }

    [JsonIgnore]
    public virtual User? Staff { get; set; }
}
