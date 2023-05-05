namespace SpaceAPI.Models.DTOs
{
    public class FleetDTO
    {
        public int ShipId { get; set; }
        public int ClassId { get; set; }
        public int WeaponId{ get; set; }
        public int DefenseId { get; set; }
        public int PropulsionId { get; set; }
        public int Count { get; set; }
    }
}
