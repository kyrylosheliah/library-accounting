using Microsoft.AspNetCore.StaticFiles;

namespace LibAcct.Librarian.Services;

public class BookCoverService { 

    public static async Task<FileContentHttpResult?> ReadBookCover(int bookId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot\\api\\book");
        var dir = new DirectoryInfo(filepath);
        IEnumerable<FileInfo> fileList = dir.GetFiles(
            $"{bookId}_cover.*",
            SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null) {
            return null;
        }
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(fileinfo, out var contentType)) {
            contentType = "application/octet-stream";
        }
        var bytes = await File.ReadAllBytesAsync(fileinfo);
        return TypedResults.File(bytes, contentType);
    }

    public static async Task WriteBookCover(int bookId, IFormFile file) {
        var split = file.FileName.Split('.');
        var extension = split[split.Length - 1];
        var filename = $"{bookId}_cover.{extension}";
        var filepath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot\\api\\book",
            filename
        );
        using (var stream = new FileStream(filepath, FileMode.Create)) {
            await file.CopyToAsync(stream);
        }
    }

    public static bool DeleteBookCover(int bookId) {
        var filepath = Path.Combine(
            Directory.GetCurrentDirectory(),
            "wwwroot\\api\\book"
        );
        var dir = new DirectoryInfo(filepath);
        IEnumerable<FileInfo> fileList = dir.GetFiles(
            $"{bookId}_cover.*",
            SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null) {
            return false;
        }
        File.Delete(fileinfo);
        return true;
    }
}