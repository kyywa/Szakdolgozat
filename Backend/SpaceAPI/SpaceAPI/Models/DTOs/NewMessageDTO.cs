namespace SpaceAPI.Models.DTOs
{
    public class NewMessageDTO
    {
        public string Receiver { get; set; } = string.Empty;
        public string Message { get; set; } = string.Empty;
    }
}