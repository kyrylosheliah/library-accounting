
using Microsoft.AspNetCore.StaticFiles;

namespace LibAcct.Reader.Services;

public class AvatarService {

    public static void WriteUserAvatar(int userId, IFormFile file)
    {
        DeleteUserAvatar(userId);
        var split = file.FileName.Split('.');
        var extension = split[split.Length - 1];
        var filename = $"{userId}_avatar.{extension}";
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars", filename);
        if (file.Length > 0)
        {
            using (Stream fileStream = new FileStream(filepath, FileMode.Create))
            {
                file.CopyTo(fileStream);
            }
        }
    }

    public static async Task<FileContentHttpResult?> ReadUserAvatar(int userId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars");
        var dir = new DirectoryInfo(filepath);
        IEnumerable<FileInfo> fileList = dir.GetFiles(
            $"{userId}_avatar.*",
            SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return null;
        }
        var provider = new FileExtensionContentTypeProvider();
        if (!provider.TryGetContentType(fileinfo, out var contenttype))
        {
            contenttype = "application/octet-stream";
        }
        var bytes = await File.ReadAllBytesAsync(fileinfo);
        return TypedResults.File(bytes, contenttype);
    }

    public static bool DeleteUserAvatar(int userId)
    {
        var filepath = Path.Combine(Directory.GetCurrentDirectory(), ".Uploads\\Avatars");
        var dir = new DirectoryInfo(filepath);
        IEnumerable<FileInfo> fileList = dir.GetFiles(
            $"{userId}_avatar.*",
            SearchOption.TopDirectoryOnly
        );
        var fileinfo = fileList.FirstOrDefault()?.FullName;
        if (fileinfo is null)
        {
            return false;
        }
        File.Delete(fileinfo);
        return true;
    }


}