namespace SpaceAPI.Models.DTOs
{
    public class PlanetDTO
    {
        public string PlanetName { get; set; } = null!;
        public string PlanetType { get; set; } = null!;
    }
    public class PlanetListDTO : PlanetDTO
    {
        public int pid { get; set; }
        public int uid { get; set; }
        public string Username { get; set;} = null!;
    }
}
