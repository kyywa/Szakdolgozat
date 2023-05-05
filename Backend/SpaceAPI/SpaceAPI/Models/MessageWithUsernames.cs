namespace SpaceAPI.Models
{
    public class MessageWithUsernames
    {
        public string Receiver { get; set; } = string.Empty;
        public string Sender { get; set; }  = string.Empty;
        public string Message { get; set; } = string.Empty;
        public bool IsReceiverDeleted { get; set; }
        public bool IsSenderDeleted { get; set; }
        public DateTime Date { get; set; }

    }
}
