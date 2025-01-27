namespace LibAcct.App.Crud;

public class CrudSpecification<T> {
    public string[] AuthorizationPolicies { get; set; } = [];
    /// <summary>
    /// T found, AppDatabase _
    /// </summary>
    public Action<T, AppDatabase>? DoBeforeDelete { get; set; } = null;
    /// <summary>
    /// int Id
    /// </summary>
    public Action<int>? DoAfterDelete { get; set; } = null;
    /// <summary>
    /// T request
    /// </summary>
    public Action<T>? ModifyAfterGet { get; set; } = null;
    /// <summary>
    /// T request
    /// </summary>
    public Action<T>? ModifyAfterGetMultiple { get; set; } = null;
    public string[]? EnsureUniqueBeforePost { get; set; } = null!;
    /// <summary>
    /// .Invoke(T request, AppDatabase _, CancellationToken _)
    /// Return `null` if the check passed or a `TypedResult` to immediately return response
    /// </summary>
    public Func<T, AppDatabase, CancellationToken, Task<IResult?>>? EnsureExistsBeforePost { get; set; } = null;
    /// <summary>
    /// .Invoke(T request, T found, HttpContext _, AppDatabase _, CancellationToken _)
    /// Return `null` if the check passed or a `TypedResult` to immediately return response
    /// </summary>
    public Func<T, HttpContext, AppDatabase, CancellationToken, Task<IResult?>>? ModifyBeforePost { get; set; } = null;
    /// <summary>
    /// T request, T created, AppDatabase _, CancellationToken _
    /// </summary>
    public Func<T, T, AppDatabase, CancellationToken, Task>? ModifyAfterPost { get; set; } = null;
    /// <summary>
    /// T request, T found
    /// </summary>
    public Action<T, T>? ModifyBeforePut { get; set; } = null;
    public bool? ForbidPut { get; set; } = null;
}