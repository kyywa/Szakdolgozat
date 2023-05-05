namespace SpaceAPI.Models.DTOs
{
    public class ShipDisplayDTO
    {
        public string Name { get; set; } = string.Empty;
        public string Type { get; set; } = string.Empty;
        public string WeaponType { get; set; } = string.Empty;
        public string DefenseType { get; set; } = string.Empty;
        public string PropulsionType { get; set; } = string.Empty;
        public int BaseAttack { get; set; }
        public int BaseDefense { get; set; }
        public int BaseSpeed { get; set; }
        public int PopCost { get; set; }
    }
}
