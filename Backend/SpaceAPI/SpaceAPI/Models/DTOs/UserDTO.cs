namespace SpaceAPI.Models
{
    public class UserDTO
    {
        public string EMail { get; set; } = null!;
        public string Password { get; set; } = null!;
    }
    public class UserDTORegister : UserDTO
    {
        public string UserName { get; set; } = null!;
    }
}
