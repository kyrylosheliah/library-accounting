using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class Return
{
    public int Id { get; set; }

    public int ReaderId { get; set; }

    public int StaffId { get; set; }

    public DateTime Date { get; set; }

    [JsonIgnore]
    public virtual User? Reader { get; set; }

    [JsonIgnore]
    public virtual ICollection<ReturnItem> ReturnItems { get; set; } = new List<ReturnItem>();

    [JsonIgnore]
    public virtual User? Staff { get; set; }
}
