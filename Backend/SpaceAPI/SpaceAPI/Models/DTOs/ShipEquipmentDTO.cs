namespace SpaceAPI.Models.DTOs
{
    public class ShipEquipmentDTO
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public int Steelmultiplier { get; set; }
        public int Uraniummultiplier { get; set; }
        public int Carbonmultiplier { get; set; }
        public int Gasmultiplier { get; set; }
    }
}
