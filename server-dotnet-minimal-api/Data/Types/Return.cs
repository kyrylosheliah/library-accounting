namespace LibAcct.Data.Types;

public class Return : IEntity
{
    public int Id { get; set; }
    public int ReaderId { get; set; }
    public int StaffId { get; set; }
    public DateTime Date { get; set; }
    public User? Reader { get; set; }
    public List<ReturnItem> ReturnItems { get; set; } = null!;
    public User? Staff { get; set; }
}
