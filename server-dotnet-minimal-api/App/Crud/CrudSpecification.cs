namespace LibAcct.App.Crud;

public class CrudSpecification<T> {
    public string? Plural = null;
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
    public Action<T>? DoAfterGet { get; set; } = null;
    /// <summary>
    /// T request
    /// </summary>
    public Action<T>? DoAfterGetMultiple { get; set; } = null;
    public string[]? EnsureUniqueBeforePost { get; set; } = null!;
    /// <summary>
    /// .Invoke(T request, HttpContext _, AppDatabase _, CancellationToken _)
    /// Return `null` if the check passed or a `TypedResult` to immediately return response
    /// </summary>
    public Func<T, HttpContext, AppDatabase, CancellationToken, Task<IResult?>>? DoBeforePost { get; set; } = null;
    /// <summary>
    /// T request, T created, AppDatabase _, CancellationToken _
    /// </summary>
    public Func<T, T, AppDatabase, CancellationToken, Task>? DoAfterPost { get; set; } = null;
    /// <summary>
    /// T request, T found
    /// </summary>
    public Action<T, T>? DoBeforePut { get; set; } = null;
    public bool? ForbidPut { get; set; } = null;
}