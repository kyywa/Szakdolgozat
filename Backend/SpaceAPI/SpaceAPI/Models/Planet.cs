using System;
using System.Collections.Generic;
using System.Text.Json.Serialization;

namespace SpaceAPI
{
    public partial class Planet
    {
        public Planet()
        {
            Fleets = new HashSet<Fleet>();
            Resources = new HashSet<Resource>();
            Shipyardqueues = new HashSet<Shipyardqueue>();
        }

        public int Id { get; set; }
        public int Uid { get; set; }
        public string Name { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int Hqlvl { get; set; }
        public int Shipyardlvl { get; set; }
        public int Refinerylvl { get; set; }

        [JsonIgnore]
        public virtual User UidNavigation { get; set; } = null!;
        public virtual ICollection<Fleet> Fleets { get; set; }
        public virtual ICollection<Resource> Resources { get; set; }
        public virtual ICollection<Shipyardqueue> Shipyardqueues { get; set; }
    }
}
