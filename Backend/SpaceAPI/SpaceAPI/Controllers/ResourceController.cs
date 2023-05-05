using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ResourceController : ControllerBase
    {
        private readonly galaxyContext _context;
        public ResourceController(galaxyContext context)
        {
            _context = context;
        }
        //Load player resources
        [HttpGet,Authorize]
        public async Task<ActionResult<Resource>> GetPlayerResources()
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(p => p.Uid == user.Id);
            Resource resource = _context.Resources.FirstOrDefault(r => r.Pid == planet.Id);
            UpdateResources(resource,planet.Hqlvl,planet.Refinerylvl);
            try
            {
                _context.Resources.Update(resource);
                _context.SaveChanges();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
            return Ok(resource);
        }
        //Upgrade resource zone
        [HttpPut,Authorize]
        public async Task<ActionResult> UpgradeResource(string resourceZone)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());
            Planet planet = _context.Planets.FirstOrDefault(p => p.Uid == user.Id);
            Resource resource = _context.Resources.FirstOrDefault(r => r.Pid == planet.Id);
            resource = UpdateResources(resource,planet.Hqlvl,planet.Refinerylvl);
            int price = 0;
            switch (resourceZone)
            {
                case "Steel":
                    price = 1000 + (resource.Steellvl * 1000);
                    if(resource.Steellvl >= 5)
                    {
                        return BadRequest("Zone is already at max level");
                    }
                    if (resource.Carboncount < price || resource.Carboncount < price || resource.Gascount < price || resource.Uraniumcount < price)
                    {
                        return BadRequest("Not enough resources.");
                    }
                    PayResources(new ResourceDTO(price,price,price,price),resource);
                    resource.Steellvl++;
                    break;
                case "Carbon":
                    price = 1000 + (resource.Carbonlvl * 1000);
                    if (resource.Steellvl >= 5)
                    {
                        return BadRequest("Zone is already at max level");
                    }
                    if (resource.Carboncount < price || resource.Carboncount < price || resource.Gascount < price || resource.Uraniumcount < price)
                    {
                        return BadRequest("Not enough resources.");
                    }
                    PayResources(new ResourceDTO(price, price, price, price), resource);
                    resource.Carbonlvl++;
                    break;
                case "Gas":
                    price = 1000 + (resource.Gaslvl * 1000);
                    if (resource.Gaslvl >= 5)
                    {
                        return BadRequest("Zone is already at max level");
                    }
                    if (resource.Carboncount < price || resource.Carboncount < price || resource.Gascount < price || resource.Uraniumcount < price)
                    {
                        return BadRequest("Not enough resources.");
                    }
                    PayResources(new ResourceDTO(price, price, price, price), resource);
                    resource.Gaslvl++;
                    break;
                case "Uranium":
                    price = 1000 + (resource.Uraniumlvl * 1000);
                    if (resource.Uraniumlvl >= 5)
                    {
                        return BadRequest("Zone is already at max level");
                    }
                    if (resource.Carboncount < price || resource.Carboncount < price || resource.Gascount < price || resource.Uraniumcount < price)
                    {
                        return BadRequest("Not enough resources.");
                    }
                    PayResources(new ResourceDTO(price, price, price, price), resource);
                    resource.Uraniumlvl++;
                    break;
                default:
                    return BadRequest("We don't have those");

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
        //Initialize a new planet's resources
        public static Resource InitResources(Planet planet)
        {
            Resource resource = new Resource();
            resource.PidNavigation = planet;
            DateTime lastUpdate = DateTime.UtcNow;
            lastUpdate.Subtract(new TimeSpan(0, 0, lastUpdate.Second));
            resource.Lastupdate = lastUpdate;
            resource.Steelcount = 1000;
            resource.Uraniumcount = 1000;
            resource.Carboncount = 1000;
            resource.Gascount = 1000;
            resource.Steellvl = 0;
            resource.Uraniumlvl = 0;
            resource.Carbonlvl = 0;
            resource.Gaslvl = 0;
            return resource;
        }
        //Update resources based on the last time they were updated
        public static Resource UpdateResources(Resource resource,int hqlvl,int reflvl)
        {
            TimeSpan timeSpan = DateTime.UtcNow.Subtract(resource.Lastupdate);
            if(timeSpan>new TimeSpan(0, 1, 0))
            {
                resource.Carboncount += Convert.ToInt32(timeSpan.TotalMinutes) * (5 + ((1 + reflvl)) * (1 + resource.Carbonlvl));
                resource.Uraniumcount += Convert.ToInt32(timeSpan.TotalMinutes) * (5 + ((1 + reflvl)) * (1 + resource.Uraniumlvl));
                resource.Gascount += Convert.ToInt32(timeSpan.TotalMinutes) * (5 + ((1 + reflvl)) * (1 + resource.Gaslvl));
                resource.Steelcount += Convert.ToInt32(timeSpan.TotalMinutes) * (5 + ((1+ reflvl)) * (1 + resource.Steellvl));
                if (resource.Carboncount > 10000 + 2 * 10000 * hqlvl) resource.Carboncount = 10000 + 2 * 10000 * hqlvl;
                if (resource.Uraniumcount > 10000 + 2 * 10000 * hqlvl) resource.Uraniumcount = 10000 + 2 * 10000 * hqlvl;
                if (resource.Gascount > 10000 + 2 * 10000 * hqlvl) resource.Gascount = 10000 + 2 * 10000 * hqlvl;
                if (resource.Steelcount > 10000 + 2 * 10000 * hqlvl) resource.Steelcount = 10000 + 2 * 10000 * hqlvl;
                DateTime lastUpdate = DateTime.UtcNow;
                lastUpdate.Subtract(new TimeSpan(0, 0, lastUpdate.Second));
                resource.Lastupdate = lastUpdate;
            }
            return resource;
        }
     

        public static Resource PayResources(ResourceDTO price, Resource resource)
        {
            resource.Steelcount -= price.Steelcount;
            resource.Carboncount -= price.Carboncount;
            resource.Gascount -= price.Gascount;
            resource.Uraniumcount -= price.Uraniumcount;
            if(resource.Steelcount<0 || resource.Carboncount<0 || resource.Gascount<0 || resource.Uraniumcount < 0)
            {
                throw new Exception("Not enough resources");
            }
            return resource;
        }

        public static Resource LootResources(int challenge, Resource resource, int hqlvl, int reflvl)
        {
            UpdateResources(resource, hqlvl, reflvl);
            resource.Carboncount += challenge/2;
            resource.Uraniumcount += challenge / 2;
            resource.Gascount += challenge / 2;
            resource.Steelcount += challenge / 2;
            if (resource.Carboncount > 10000 + 2 * 10000 * hqlvl) resource.Carboncount = 10000 + 2 * 10000 * hqlvl;
            if (resource.Uraniumcount > 10000 + 2 * 10000 * hqlvl) resource.Uraniumcount = 10000 + 2 * 10000 * hqlvl;
            if (resource.Gascount > 10000 + 2 * 10000 * hqlvl) resource.Gascount = 10000 + 2 * 10000 * hqlvl;
            if (resource.Steelcount > 10000 + 2 * 10000 * hqlvl) resource.Steelcount = 10000 + 2 * 10000 * hqlvl;
            DateTime lastUpdate = DateTime.UtcNow;
            return resource;
        }

    }
}
