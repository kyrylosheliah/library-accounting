namespace LibAcct.Data.Types;

public class User : IEntity
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
    public List<Appointment> Appointments { get; set; } = null!;
    public List<Borrow> BorrowReaders { get; set; } = null!;
    public List<Borrow> BorrowStaffs { get; set; } = null!;
    public List<Debt> Debts { get; set; } = null!;
    public List<Enrollment> Enrollments { get; set; } = null!;
    public List<MembershipTransaction> MembershipTransactions { get; set; } = null!;
    public List<Membership> Memberships { get; set; } = null!;
    public List<Return> ReturnReaders { get; set; } = null!;
    public List<Return> ReturnStaffs { get; set; } = null!;
    public List<UserClaim> UserClaims { get; set; } = null!;
    public List<Wish> Wishes { get; set; } = null!;
}
