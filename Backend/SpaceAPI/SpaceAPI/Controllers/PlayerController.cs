using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PlayerController : ControllerBase
    {
        private readonly galaxyContext _context;
        public PlayerController(galaxyContext context)
        {
            _context = context;
        }
        [HttpGet, Authorize]
        public async Task<ActionResult<List<string>>> GetPlayerList([FromQuery] string input = "")
        {
            List<string> players = new List<string>();
            if(String.IsNullOrEmpty(input))
            {
                foreach(var item in _context.Users)
                {
                    players.Add(item.Username);
                }
                return Ok(players);
            }
            foreach (var item in _context.Users.Where(n => n.Username.Contains(input)))
            {
                players.Add(item.Username);
            }
            return Ok(players);

        }
    }
}
