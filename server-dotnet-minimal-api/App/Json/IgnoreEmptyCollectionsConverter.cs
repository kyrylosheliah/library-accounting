using System.Text.Json;
using System.Text.Json.Serialization;

namespace LibAcct.App.Json;

public class IgnoreEmptyCollectionsConverter<T> : JsonConverter<ICollection<T>>
{
    public override ICollection<T> Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        throw new NotImplementedException(); // Optional if deserialization is needed
    }

    public override void Write(Utf8JsonWriter writer, ICollection<T> value, JsonSerializerOptions options)
    {
        if (value == null || value.Count == 0)
        {
            return; // Do not write the property if it's null or empty
        }

        JsonSerializer.Serialize(writer, value, options);
    }
}