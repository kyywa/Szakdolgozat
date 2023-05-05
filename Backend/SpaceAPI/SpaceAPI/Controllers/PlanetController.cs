using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class PlanetController : ControllerBase
    {
        private readonly galaxyContext _context;
        public PlanetController(galaxyContext context)
        {
            _context = context;
        }
        //List all planets, maybe it'll be useful at some point
        [HttpGet]
        public async Task<ActionResult<List<Planet>>> GetAllPlanets()
        {
            var planets = new List<Planet>();
            try
            {
                planets = _context.Planets.ToList();
                return Ok(planets);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        //Load Planet
        [HttpGet, Authorize]
        public async Task<ActionResult> GetPlayerPlanet()
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            if (planet != null)
            {
                return Ok(planet);
            }
            return BadRequest("Go to brazil");
        }

        //Create Planet
        [HttpPost, Authorize]
        public async Task<ActionResult<Planet>> CreatePlanet(PlanetDTO tmp)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            if (_context.Planets.FirstOrDefault(u => u.Uid == user.Id) == null)
            {
                Planet planet = new Planet();
                Resource resource = new Resource();
                planet.Uid = user.Id;
                planet.Type = tmp.PlanetType;
                planet.Name = tmp.PlanetName;
                planet.Hqlvl = 1;
                planet.Shipyardlvl = 0;
                planet.Refinerylvl = 0;
                try
                {
                    _context.Resources.Add(ResourceController.InitResources(planet));
                    _context.SaveChanges();
                    return Ok(planet);
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }

            }
            else
            {
                return BadRequest();
            }
        }
        //Upgrade buildings
        [HttpPut, Authorize]
        public async Task<ActionResult> UpgradeBuilding(string building)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            Resource resource = _context.Resources.FirstOrDefault(u => u.Pid == planet.Id);
            resource = ResourceController.UpdateResources(resource, planet.Hqlvl, planet.Hqlvl);
            int price = 0;
            switch (building)
            {
                case "HQ":
                    price = 5000 + (planet.Hqlvl * 5000);
                    if(planet.Hqlvl >= 5)
                    {
                        return Ok("Already max level");
                    }
                    try
                    {
                        ResourceController.PayResources(new ResourceDTO(price, price, price, price), resource);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                    planet.Hqlvl++;
                    break;
                case "Shipyard":
                    price = 5000 + (planet.Shipyardlvl * 5000);
                    if (planet.Hqlvl >= 5)
                    {
                        return Ok("Already max level");
                    }
                    try
                    {
                        ResourceController.PayResources(new ResourceDTO(price, price, price, price), resource);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }
                    planet.Shipyardlvl++;
                    break;
                case "Refinery":
                    price = 5000 + (planet.Refinerylvl * 5000);
                    if (planet.Hqlvl >= 5)
                    {
                        return Ok("Already max level");
                    }
                    try
                    {
                        ResourceController.PayResources(new ResourceDTO(price, price, price, price), resource);
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }

                    planet.Refinerylvl++;
                    break;
                default:
                    return BadRequest("You don't do that");
            }
            try
            {
                _context.Resources.Update(resource);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok();
        }

    }
}
