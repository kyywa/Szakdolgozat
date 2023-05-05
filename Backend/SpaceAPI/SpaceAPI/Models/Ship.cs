using System;
using System.Collections.Generic;

namespace SpaceAPI
{
    public partial class Ship
    {
        public int Id { get; set; }
        public int Classid { get; set; }
        public int Weapontype { get; set; }
        public int Defensetype { get; set; }
        public int Propulsiontype { get; set; }
    }
}
