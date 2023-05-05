using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace SpaceAPI
{
    public partial class Shipclass
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int Baseattack { get; set; }
        public int Basedefense { get; set; }
        public int Basespeed { get; set; }
        public int Popcost { get; set; }
        [JsonConverter(typeof(TimeOnlyConverter))]
        public TimeOnly Buildtime { get; set; }
        public int Scost { get; set; }
        public int Ucost { get; set; }
        public int Ccost { get; set; }
        public int Gcost { get; set; }
    }
    public class TimeOnlyConverter : JsonConverter<TimeOnly>
    {
        private const string Format = "HH:mm:ss";

        public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
        {
            string value = reader.GetString();
            return TimeOnly.ParseExact(value, Format, null);
        }

        public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
        {
            writer.WriteStringValue(value.ToString(Format));
        }
    }
}
