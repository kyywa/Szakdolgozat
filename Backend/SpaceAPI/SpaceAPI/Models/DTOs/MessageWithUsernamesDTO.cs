namespace SpaceAPI.Models.DTOs
{
    public class MessageWithUsernamesDTO
    {
        public string Receiver { get; set; } = string.Empty;
        public string Sender { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
    }
}
