namespace LibAcct.Data;

public class AppDatabase(DbContextOptions<AppDatabase> options) : DbContext(options) {

    public DbSet<Appointment> Appointments { get; set; }
    public DbSet<Book> Books { get; set; }
    public DbSet<BookCategory> BookCategories { get; set; }
    public DbSet<Borrow> Borrows { get; set; }
    public DbSet<BorrowItem> BorrowItems { get; set; }
    public DbSet<Debt> Debts { get; set; }
    public DbSet<Enrollment> Enrollments { get; set; }
    public DbSet<EnrollmentEvent> EnrollmentEvents { get; set; }
    public DbSet<Membership> Memberships { get; set; }
    public DbSet<MembershipTransaction> MembershipTransactions { get; set; }
    public DbSet<Return> Returns { get; set; }
    public DbSet<ReturnItem> ReturnItems { get; set; }
    public DbSet<Shelf> Shelves { get; set; }
    public DbSet<Supplier> Suppliers { get; set; }
    public DbSet<Supply> Supplies { get; set; }
    public DbSet<SupplyItem> SupplyItems { get; set; }
    public DbSet<User> Users { get; set; }
    public DbSet<UserClaim> UserClaims { get; set; }
    public DbSet<Wish> Wishes { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {

        modelBuilder.Entity<Appointment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Appointment_pkey");

            entity.ToTable("Appointment");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone");
            entity.Property(e => e.Created).HasColumnType("timestamp with time zone");
            entity.Property(e => e.Modified).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Staff)
                .WithMany(p => p.Appointments)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Appointment_StaffId_fkey");
        });

        modelBuilder.Entity<Book>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Book_pkey");

            entity.ToTable("Book");

            entity.Property(e => e.Isbn).HasColumnName("ISBN");

            entity
                .HasOne(d => d.Category)
                .WithMany(p => p.Books)
                .HasForeignKey(d => d.CategoryId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Book_CategoryId_fkey");
        });

        modelBuilder.Entity<BookCategory>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("BookCategory_pkey");

            entity.ToTable("BookCategory");
        });

        modelBuilder.Entity<Borrow>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Borrow_pkey");

            entity.ToTable("Borrow");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Reader)
                .WithMany(p => p.BorrowReaders)
                .HasForeignKey(d => d.ReaderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Borrow_ReaderId_fkey");

            entity
                .HasOne(d => d.Staff)
                .WithMany(p => p.BorrowStaffs)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Borrow_StaffId_fkey");
        });

        modelBuilder.Entity<BorrowItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("BorrowItem_pkey");

            entity.ToTable("BorrowItem");

            entity.Property(e => e.ExpirationDate).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Book)
                .WithMany(p => p.BorrowItems)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("BorrowItem_BookId_fkey");

            entity
                .HasOne(d => d.Borrow)
                .WithMany(p => p.BorrowItems)
                .HasForeignKey(d => d.BorrowId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("BorrowItem_BorrowId_fkey");
        });

        modelBuilder.Entity<Debt>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Debt_pkey");

            entity.ToTable("Debt");

            entity
                .HasOne(d => d.BorrowItem)
                .WithMany(p => p.Debts)
                .HasForeignKey(d => d.BorrowItemId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Debt_BorrowItemId_fkey");

            entity
                .HasOne(d => d.Reader)
                .WithMany(p => p.Debts)
                .HasForeignKey(d => d.ReaderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Debt_ReaderId_fkey");
        });

        modelBuilder.Entity<Enrollment>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Enrollment_pkey");

            entity.ToTable("Enrollment");

            entity.Property(e => e.EventDate).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Event)
                .WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.EventId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Enrollment_EventId_fkey");

            entity
                .HasOne(d => d.Staff)
                .WithMany(p => p.Enrollments)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Enrollment_StaffId_fkey");
        });

        modelBuilder.Entity<EnrollmentEvent>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("EnrollmentEvent_pkey");

            entity.ToTable("EnrollmentEvent");
        });

        modelBuilder.Entity<Membership>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Membership_pkey");

            entity.ToTable("Membership");

            entity.Property(e => e.ExpirationDate).HasColumnType("timestamp with time zone");
            entity.Property(e => e.StartDate).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Reader)
                .WithMany(p => p.Memberships)
                .HasForeignKey(d => d.ReaderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Membership_ReaderId_fkey");
        });

        modelBuilder.Entity<MembershipTransaction>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("MembershipTransaction_pkey");

            entity.ToTable("MembershipTransaction");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Reader)
                .WithMany(p => p.MembershipTransactions)
                .HasForeignKey(d => d.ReaderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("MembershipTransaction_ReaderId_fkey");
        });

        modelBuilder.Entity<Return>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Return_pkey");

            entity.ToTable("Return");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Reader)
                .WithMany(p => p.ReturnReaders)
                .HasForeignKey(d => d.ReaderId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Return_ReaderId_fkey");

            entity
                .HasOne(d => d.Staff)
                .WithMany(p => p.ReturnStaffs)
                .HasForeignKey(d => d.StaffId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Return_StaffId_fkey");
        });

        modelBuilder.Entity<ReturnItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("ReturnItem_pkey");

            entity.ToTable("ReturnItem");

            entity
                .HasOne(d => d.Book)
                .WithMany(p => p.ReturnItems)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("ReturnItem_BookId_fkey");

            entity
                .HasOne(d => d.Return)
                .WithMany(p => p.ReturnItems)
                .HasForeignKey(d => d.ReturnId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("ReturnItem_ReturnId_fkey");
        });

        modelBuilder.Entity<Shelf>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Shelf_pkey");

            entity.ToTable("Shelf");

            entity
                .HasOne(d => d.Book)
                .WithMany(p => p.Shelves)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Shelf_BookId_fkey");
        });

        modelBuilder.Entity<Supplier>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Supplier_pkey");

            entity.ToTable("Supplier");
        });

        modelBuilder.Entity<Supply>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Supply_pkey");

            entity.ToTable("Supply");

            entity.Property(e => e.Date).HasColumnType("timestamp with time zone");

            entity
                .HasOne(d => d.Supplier)
                .WithMany(p => p.Supplies)
                .HasForeignKey(d => d.SupplierId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Supply_SupplierId_fkey");
        });

        modelBuilder.Entity<SupplyItem>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("SupplyItem_pkey");

            entity.ToTable("SupplyItem");

            entity
                .HasOne(d => d.Book)
                .WithMany(p => p.SupplyItems)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("SupplyItem_BookId_fkey");

            entity
                .HasOne(d => d.Supply)
                .WithMany(p => p.SupplyItems)
                .HasForeignKey(d => d.SupplyId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("SupplyItem_SupplyId_fkey");
        });

        modelBuilder.Entity<User>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("User_pkey");

            entity.ToTable("User");

            entity.Property(e => e.Gender).HasMaxLength(1);
            entity.Property(e => e.DateOfBirth).HasColumnType("timestamp with time zone");
            entity.Property(e => e.LockoutEnabled).HasColumnType("boolean");
            entity.Property(e => e.RegisterDate).HasColumnType("timestamp with time zone");
        });

        modelBuilder.Entity<UserClaim>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("UserClaim_pkey");

            entity.ToTable("UserClaim");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.UserClaims)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("UserClaim_UserId_fkey");
        });

        modelBuilder.Entity<Wish>(entity =>
        {
            entity.HasKey(e => e.Id).HasName("Wish_pkey");

            entity.ToTable("Wish");

            entity
                .HasOne(d => d.Book)
                .WithMany(p => p.Wishes)
                .HasForeignKey(d => d.BookId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Wish_BookId_fkey");

            entity
                .HasOne(d => d.User)
                .WithMany(p => p.Wishes)
                .HasForeignKey(d => d.UserId)
                .OnDelete(DeleteBehavior.Restrict)
                .HasConstraintName("Wish_UserId_fkey");
        });

        base.OnModelCreating(modelBuilder);
    }

}