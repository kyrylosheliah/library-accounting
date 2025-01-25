using System.Linq.Dynamic.Core;

namespace LibAcct.Common.Api.Extensions;

public static class IQueryableExtensions {
    public static async Task<ValueTuple<int, List<T>>> ToPagedFilteredListAsync<T>(
        this IQueryable<T> entities,
        T entityInstance,
        PagedEntityFilterRequest request,
        CancellationToken cancellationToken = default
    ) {
        new PagedEntityFilterRequestValidator().ValidateAndThrow(request);
        if (request.Criteria is not null) {
            foreach (var criterion in request.Criteria) {
                if (criterion.Value == "") {
                    continue;
                }
                var property = entityInstance.GetType().GetProperty(criterion.Column);
                if (property is null) {
                    return new ValueTuple<int, List<T>>(0, []);
                }
                if (criterion.Column.Contains("Id")) {
                    entities = entities.Where(
                        $"{criterion.Column}.ToString()==(\"{criterion.Value.ToLower()}\")"
                    );
                }
                else {
                    var makeString = property.PropertyType == typeof(string) ? "" : ".ToString()";
                    entities = entities.Where(
                        $"{criterion.Column}{makeString}.ToLower().Contains(\"{criterion.Value.ToLower()}\")"
                    );
                }
            }
        }
        var searchCount = entities.Count();
        if (searchCount == 0) {
            return new ValueTuple<int, List<T>>(0, []);
        }
        var pageModulo = searchCount % request.PageSize;
        var pageCount = (searchCount - pageModulo) / request.PageSize + (pageModulo == 0 ? 0 : 1);
        var toSkip = (request.PageNo - 1) * request.PageSize;
        var toTake = request.PageSize;
        if (request.Ascending) {
            entities = entities.OrderBy(e => EF.Property<object>(e, request.OrderByColumn));
        }
        else {
            entities = entities.OrderByDescending(
                e => EF.Property<object>(e, request.OrderByColumn)
            );
        }
        var result = entities.Skip(toSkip).Take(toTake);
        return new ValueTuple<int, List<T>>(
            pageCount,
            await result.ToListAsync(cancellationToken)
        );
    }
}