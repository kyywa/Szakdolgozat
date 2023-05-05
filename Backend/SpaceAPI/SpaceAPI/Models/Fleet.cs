using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SpaceAPI
{
    public partial class Fleet
    {
        public int Id { get; set; }
        public int Pid { get; set; }
        public int Sid { get; set; }
        public int Count { get; set; }

        [JsonIgnore]
        public virtual Planet PidNavigation { get; set; } = null!;
    }
}
