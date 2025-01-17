using System.Text.Json.Serialization;

namespace LibAcct.Models;

public partial class User
{
    public static User PasswordlessClone(User from)
    {
        return new User()
        {
            Id = from.Id,
            Name = from.Name,
            Email = from.Email,
            PasswordHash = "",
            Phone = from.Phone,
            LockoutEnabled = from.LockoutEnabled,
            DateOfBirth = from.DateOfBirth,
            Address = from.Address,
            Gender = from.Gender,
            RegisterDate = from.RegisterDate
        };
    }

    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string PasswordHash { get; set; } = null!;

    public string? Phone { get; set; }

    public bool LockoutEnabled { get; set; }

    public DateTime? DateOfBirth { get; set; }

    public string? Address { get; set; }

    public char? Gender { get; set; }

    public DateTime RegisterDate { get; set; }

    [JsonIgnore]
    public virtual ICollection<Appointment> Appointments { get; set; } = new List<Appointment>();

    [JsonIgnore]
    public virtual ICollection<Borrow> BorrowReaders { get; set; } = new List<Borrow>();

    [JsonIgnore]
    public virtual ICollection<Borrow> BorrowStaffs { get; set; } = new List<Borrow>();

    [JsonIgnore]
    public virtual ICollection<Debt> Debts { get; set; } = new List<Debt>();

    [JsonIgnore]
    public virtual ICollection<Enrollment> Enrollments { get; set; } = new List<Enrollment>();

    [JsonIgnore]
    public virtual ICollection<MembershipTransaction> MembershipTransactions { get; set; } =
        new List<MembershipTransaction>();

    [JsonIgnore]
    public virtual ICollection<Membership> Memberships { get; set; } = new List<Membership>();

    [JsonIgnore]
    public virtual ICollection<Return> ReturnReaders { get; set; } = new List<Return>();

    [JsonIgnore]
    public virtual ICollection<Return> ReturnStaffs { get; set; } = new List<Return>();

    [JsonIgnore]
    public virtual ICollection<UserClaim> UserClaims { get; set; } = new List<UserClaim>();

    [JsonIgnore]
    public virtual ICollection<Wish> Wishes { get; set; } = new List<Wish>();
}
