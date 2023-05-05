using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ExplorationController : ControllerBase
    {
        private readonly galaxyContext _context;
        public ExplorationController(galaxyContext context)
        {
            _context = context;
        }
        [HttpGet,Authorize]
        public async Task<ActionResult<TimeSpan>> GetExplorationCooldown()
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            var exploration = _context.Explorations.FirstOrDefault(e => e.Pid == planet.Id);
            if (exploration == null) return new TimeSpan(0, 0, 0);
            if(exploration.Cooldownenddate < DateTime.UtcNow)
            {
                _context.Explorations.Remove(exploration);
                return new TimeSpan(0, 0, 0);
            }
            return exploration.Cooldownenddate.Subtract(DateTime.UtcNow);          
        }
        [HttpGet, Authorize]
        public async Task<ActionResult> GetExplorationDamage(int difficulty, List<Fleet> fleets)
        {
            int challenge = 0;
            int playerStrength = 0;
            foreach (var item in fleets)
            {
                Ship ship = _context.Ships.First(ship => ship.Id == item.Sid);
                var classStats = ShipController.GetShipStats(ship.Classid);
                for(int i = 0; i < item.Count; i++)
                {
                    playerStrength += classStats.attack + (classStats.attack / 10) * (40 - classStats.speed); 
                }
            }
            switch (difficulty)
            {
                case 1:
                    challenge = 1000;
                    return Ok(challenge - playerStrength);
                case 2:
                    challenge = 2500;
                    return Ok(challenge - playerStrength);
                case 3:
                    challenge = 5000;
                    return Ok(challenge - playerStrength);
                case 4:
                    challenge = 10000;
                    return Ok(challenge - playerStrength);
                case 5:
                    challenge = 25000;
                    return Ok(challenge - playerStrength);
                default:
                    return BadRequest("No such difficulty exists");
            }
        }
        [HttpPost,Authorize]
        public async Task<ActionResult<string>> SendExploration(ExplorationDTO exploration)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            var expCooldownTest = _context.Explorations.FirstOrDefault(e => e.Pid == planet.Id);
            if(expCooldownTest != null && expCooldownTest.Cooldownenddate > DateTime.UtcNow)
            {
                return BadRequest(expCooldownTest.Cooldownenddate.Subtract(DateTime.UtcNow).ToString());
            }
            else if(expCooldownTest != null)
            {
                _context.Explorations.Remove(expCooldownTest);
            }
            Resource resource = _context.Resources.FirstOrDefault(p => p.Pid == planet.Id);
            List<Fleet> planetFleets = _context.Fleets.Where(f => f.Pid == planet.Id).ToList();
            if(exploration.difficulty == 5 && planet.Hqlvl != 5)
            {
                return Ok("5. szintű HQ szükséges");
            }
            int challenge = GetDifficulty(exploration.difficulty);
            int playerStrength = 0;
            foreach (var item in exploration.fleets)
            {
                Ship ship = _context.Ships.First(ship => ship.Id == item.ShipId);
                var classStats = ShipController.GetShipStats(ship.Classid);
                for (int i = 0; i < item.Count; i++)
                {
                    playerStrength += classStats.attack + (classStats.attack / 10) * (40 - classStats.speed);
                }
            }
            if (playerStrength < challenge)
            {
                foreach(var item in exploration.fleets)
                {
                    planetFleets.First(f => f.Sid == item.ShipId).Count -= item.Count;
                }
            }
            else if(playerStrength < challenge+ challenge / 2)
            {
                int counter = 0;
                foreach (var item in exploration.fleets)
                {
                    counter += item.Count;
                }
                foreach (var item in exploration.fleets)
                {
                    Random r = new Random();
                    int loss = r.Next(0, item.Count);
                    counter -= loss;
                    planetFleets.First(f => f.Sid == item.ShipId).Count -= loss;
                    if(counter > 0)
                    {
                        ResourceController.LootResources(challenge, resource, planet.Hqlvl, planet.Refinerylvl);
                    }
                }
            }
            else
            {
                ResourceController.LootResources(challenge, resource, planet.Hqlvl, planet.Refinerylvl);
            }
            foreach(var item in planetFleets)
            {
                _context.Update(item);
            }
            _context.Explorations.Add(new Exploration
            {
                Pid = planet.Id,
                Cooldownenddate = DateTime.UtcNow.Add(new TimeSpan(exploration.difficulty,0,0))
            });
            _context.SaveChanges();
            return Ok();


        }
        public static int GetDifficulty(int difficulty)
        {
            switch (difficulty)
            {
                case 1:
                     return 1000;
                case 2:
                     return 2500;
                case 3:
                     return 5000;
                case 4:
                     return 10000;
                case 5:
                     return 25000;
                default:
                     return 0;
            }
        }
    }
}
