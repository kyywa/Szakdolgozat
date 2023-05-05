using System;
using System.Collections.Generic;
using Newtonsoft.Json;


namespace SpaceAPI
{
    public partial class Resource
    {
        public int Id { get; set; }
        public int Pid { get; set; }
        public DateTime Lastupdate { get; set; }
        public int Steelcount { get; set; }
        public int Steellvl { get; set; }
        public int Uraniumcount { get; set; }
        public int Uraniumlvl { get; set; }
        public int Carboncount { get; set; }
        public int Carbonlvl { get; set; }
        public int Gascount { get; set; }
        public int Gaslvl { get; set; }

        [JsonIgnore]
        public virtual Planet PidNavigation { get; set; } = null!;
    }
}
