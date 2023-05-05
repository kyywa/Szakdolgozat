namespace SpaceAPI.Models.DTOs
{
    public class ExplorationDTO
    {
        public List<FleetDTO> fleets { get; set; } = null!;
        public int difficulty { get; set; }
    }
}
