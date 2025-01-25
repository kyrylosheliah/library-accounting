namespace LibAcct.Common.Api.Requests;

public class PagedEntityFilterRequest {
    public static readonly int MaxPageSize = 20;

    public int PageNo { get; set; } = 1;
    public int PageSize { get; set; } = 8;
    public bool Ascending { get; set; } = true;
    public string OrderByColumn { get; set; } = "Id";
    public List<Criterion>? Criteria { get; set; } = null;
}

public class PagedEntityFilterRequestValidator : AbstractValidator<PagedEntityFilterRequest> {
    public PagedEntityFilterRequestValidator() {
        RuleFor(r => r.PageNo).GreaterThan(0);
        RuleFor(r => r.PageSize)
            .GreaterThan(0)
            .LessThanOrEqualTo(PagedEntityFilterRequest.MaxPageSize);
    }
}