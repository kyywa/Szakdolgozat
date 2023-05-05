using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class BattleController : ControllerBase
    {
        private readonly galaxyContext _context;
        public BattleController(galaxyContext context)
        {
            _context = context;
        }
        [HttpGet,Authorize]
        public async Task<ActionResult<List<Battlelog>>> GetLeaderboard()
        {
            List<Battlelog> leaderboard = new List<Battlelog>();
            foreach(var item in _context.Battlelogs)
            {
                leaderboard.Add(item);
            }
            return Ok(leaderboard);
        } 
        [HttpGet,Authorize]
        public async Task<ActionResult<List<PlanetListDTO>>> GetTargetPlanets()
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet playerPlanet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            List<PlanetListDTO> planetDtos = new List<PlanetListDTO>();
            List<Planet> planets = _context.Planets.ToList();
            foreach (var item in planets)
            {
                if (item != playerPlanet)
                {
                    planetDtos.Add(new PlanetListDTO
                    {
                        pid = item.Id,
                        uid = item.Uid,
                        Username = _context.Users.First(u=>u.Id==item.Uid).Username,
                        PlanetName = item.Name,
                        PlanetType = item.Type,
                    });
                }
            }
            List <Battlelog> leaderboard = _context.Battlelogs.ToList();
            foreach(var item in leaderboard)
            {
                if(item.Lastbattle+new TimeSpan(2, 0, 0) > DateTime.UtcNow)
                {
                    planetDtos.Remove(planetDtos.FirstOrDefault(p => p.uid == item.Uid));
                }
            }
            return Ok(planetDtos);
        }
        [HttpPut,Authorize]
        public async Task<ActionResult<string>> AttackPlanet(int targetPlanetId, List<FleetDTO> playerFleet)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet playerPlanet = _context.Planets.FirstOrDefault(p => p.Uid == user.Id);
            Planet targetPlanet = _context.Planets.FirstOrDefault(p => p.Id == targetPlanetId);
            var playerLog = _context.Battlelogs.FirstOrDefault(l => l.Uid == user.Id);
            var enemyLog = _context.Battlelogs.FirstOrDefault(l => l.Uid == targetPlanet.Uid);
            if (playerLog == null)
            {
                playerLog = new Battlelog
                {
                    Uid = user.Id,
                    Score = 0
                };
                _context.Battlelogs.Add(playerLog);
                _context.SaveChanges();
            }
            if (enemyLog == null)
            {
                enemyLog = new Battlelog
                {
                    Uid = targetPlanet.Uid,
                    Score = 0
                };
                _context.Battlelogs.Add(enemyLog);
                _context.SaveChanges();
            }
            var enemyFleet = _context.Fleets.Where(f=>f.Pid == targetPlanetId).ToList();
            int enemyDefense = 0;
            int playerAttack = 0;
            foreach (var fleet in enemyFleet)
            {
                Ship ship = _context.Ships.First(s => s.Id == fleet.Sid);
                enemyDefense += ShipController.GetShipStats(ship.Classid).defense * fleet.Count;
            }
            foreach (var fleet in playerFleet)
            {
                Ship ship = _context.Ships.First(s => s.Id == fleet.ShipId);
                playerAttack += ShipController.GetShipStats(ship.Classid).defense * fleet.Count;
            }
            if(enemyDefense < playerAttack + playerAttack / 2)
            {
                playerLog.Score += 3;
                enemyLog.Lastbattle = DateTime.UtcNow;
                _context.Battlelogs.Update(playerLog);
                _context.SaveChanges();
                return Ok("Victory");
            }
            else if(enemyDefense > playerAttack - playerAttack / 4)
            {
                enemyLog.Score += 3;
                enemyLog.Lastbattle = DateTime.UtcNow;
                _context.Battlelogs.Update(enemyLog);
                _context.SaveChanges();
                return Ok("Defeat");
            }
            else
            {
                playerLog.Score += 1;
                enemyLog.Score += 1;
                enemyLog.Lastbattle = DateTime.UtcNow;
                _context.Battlelogs.Update(playerLog);
                _context.Battlelogs.Update(enemyLog);
                _context.SaveChanges();
                return Ok("Draw");
            }

        }
    }
}
