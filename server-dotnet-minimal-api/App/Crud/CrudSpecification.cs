namespace LibAcct.App.Crud;

public class CrudSpecification<T> {
    public string[] AuthorizationPolicies { get; set; } = [];
    public Action<int>? DoAfterDelete { get; set; } = null;
    public Action<T>? ModifyAfterGet { get; set; } = null;
    public Action<T>? ModifyAfterGetMultiple { get; set; } = null;
    public string[]? EnsureUniqueBeforePost { get; set; } = null!;
    public Func<T, AppDatabase, CancellationToken, Task<bool>>? EnsureExistsBeforePost { get; set; } = null;
    public Action<T>? ModifyBeforePost { get; set; } = null;
    public Action<T>? ModifyAfterPost { get; set; } = null;
    public Action<T, T>? ModifyBeforePut { get; set; } = null;
    public bool? ForbidPut { get; set; } = null;
}