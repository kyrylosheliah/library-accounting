using System.ComponentModel.DataAnnotations;
using LibAcct.Models;

public class RegisterRequest
{
    [Required]
    public string email { get; set; } = null!;

    [Required]
    public string name { get; set; } = null!;

    [Required]
    public string password { get; set; } = null!;
}

public class LogInRequest
{
    [Required]
    public string email { get; set; } = null!;

    [Required]
    public string password { get; set; } = null!;
}

public class ChangePasswordRequest
{
    [Required]
    public string currentPassword { get; set; } = null!;

    [Required]
    public string password1 { get; set; } = null!;

    [Required]
    public string password2 { get; set; } = null!;
}

public class UserFormRequest
{
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string? Phone { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public char? Gender { get; set; }
}

public class Criteria
{
    public string column { get; set; } = "";
    public string value { get; set; } = "";
}

public class EntityFilterRequest
{
    [Range(1, int.MaxValue)]
    public int pageNo { get; set; } = 1;

    [Range(1, 20)]
    public int pageSize { get; set; } = 8;
    public bool ascending { get; set; } = true;
    public string orderByColumn { get; set; } = "Id";
    public List<Criteria>? criterias { get; set; }
}

public class DebtInstance
{
    public int BorrowItemId { get; set; }
    public DateTime BorrowDate { get; set; }
    public Book? Book { get; set; }
    public string? BookCategory { get; set; }
    public int Quantity { get; set; }
    public DateTime ExpirationDate { get; set; }
}

public class BorrowInstance
{
    public int BorrowId { get; set; }
    public int StaffId { get; set; }
    public int ReaderId { get; set; }
    public DateTime BorrowDate { get; set; }
    public List<BorrowPosition>? Cart { get; set; }

    public class BorrowPosition
    {
        public int BorrowItemId { get; set; }
        public Book? Book { get; set; }
        public string? BookCategory { get; set; }
        public int Quantity { get; set; }

        public DateTime ExpirationDate { get; set; }
    }
}

public class ReturnInstance
{
    public int ReturnId { get; set; }
    public int ReaderId { get; set; }
    public int StaffId { get; set; }
    public DateTime ReturnDate { get; set; }
    public List<ReturnPosition>? Cart { get; set; }

    public class ReturnPosition
    {
        public int ReturnItemId { get; set; }
        public Book? Book { get; set; }
        public string? BookCategory { get; set; }
        public int Quantity { get; set; }
    }
}

public class WishInstance
{
    public int Id { get; set; }
    public Book? Book { get; set; }
    public string? BookCategory { get; set; }
}
