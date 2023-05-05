using System;
using System.Collections.Generic;

namespace SpaceAPI
{
    public partial class Battlelog
    {
        public int Id { get; set; }
        public int Uid { get; set; }
        public DateTime Lastbattle { get; set; }
        public int Score { get; set; }
    }
}
