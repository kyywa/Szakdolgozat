using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace SpaceAPI
{
    public partial class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = null!;
        public string EMail { get; set; } = null!;
        public byte[] PWHash { get; set; } = null!;
        public byte[] PWSalt { get; set; } = null!;

        [JsonIgnore]
        public virtual Planet? Planet { get; set; }
    }
}
