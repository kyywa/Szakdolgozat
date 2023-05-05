using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SpaceAPI
{
    public partial class Shipyardqueue
    {
        public int Id { get; set; }
        public int Pid { get; set; }
        public int Sid { get; set; }
        public DateTime Done { get; set; }

        [JsonIgnore]
        public virtual Planet PidNavigation { get; set; } = null!;
    }
}
