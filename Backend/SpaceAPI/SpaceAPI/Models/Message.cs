using System;
using System.Collections.Generic;

namespace SpaceAPI.Models
{
    public partial class Message
    {
        public int Id { get; set; }
        public int Senderid { get; set; }
        public bool Senderdeleted { get; set; }
        public int Recieverid { get; set; }
        public bool Receiverdeleted { get; set; }
        public DateTime Date { get; set; }
        public string MessageBody { get; set; } = null!;
    }
}
