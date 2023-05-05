namespace SpaceAPI.Models.DTOs
{
    public class ResourceDTO
    {
        public int Steelcount { get; set; }
        public int Uraniumcount { get; set; }
        public int Carboncount { get; set; }
        public int Gascount { get; set; }

        public ResourceDTO() { }
        public ResourceDTO(int steelcount, int uraniumcount, int carboncount, int gascount)
        {
            Steelcount = steelcount;
            Uraniumcount = uraniumcount;
            Carboncount = carboncount;
            Gascount = gascount;
        }

    }
}
