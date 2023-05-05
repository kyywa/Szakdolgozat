using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class FleetController : ControllerBase
    {
        private readonly galaxyContext _context;
        public FleetController(galaxyContext context)
        {
            _context = context;
        }

        [HttpGet,Authorize]
        public ActionResult GetPlayerFleet()
        {
            try
            {
                var claim = User.Claims.First(c => c.Type == "username").Value;
                User user = _context.Users.First(u => u.Username == claim.ToString());               
                Planet planet = _context.Planets.First(u => u.Uid == user.Id);
                ShipyardqueueController.UpdateShipyardQueue(planet.Id);
                List<Shipclass> shipClasses = ShipController.LoadShipClasses();
                List<Fleet> fleets = _context.Fleets.Where(fleet => fleet.Pid == planet.Id).ToList();
                List<FleetDTO> fleetDtos = new();
                foreach(Fleet fleet in fleets)
                {
                    Ship ship = _context.Ships.First(ship => ship.Id == fleet.Sid);

                    FleetDTO fleetDto = new()
                    {
                        ShipId = ship.Id,
                        ClassId = ship.Classid,
                        WeaponId = ship.Weapontype,
                        DefenseId = ship.Defensetype,
                        PropulsionId = ship.Propulsiontype,
                        Count = fleet.Count
                    };

                    fleetDtos.Add(fleetDto);
                }

                return Ok(fleetDtos);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
