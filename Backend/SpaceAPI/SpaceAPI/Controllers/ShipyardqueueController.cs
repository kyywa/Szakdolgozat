using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceAPI.Models.DTOs;
using System.Text.Json;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ShipyardqueueController : ControllerBase
    {
        private readonly galaxyContext _context;
        public ShipyardqueueController(galaxyContext context)
        {
            _context = context;
        }
        [HttpPost, Authorize]
        public async Task<ActionResult> AddShipToQueue(ShipDTO ship)
        {
            var claim = User.Claims.First(c => c.Type == "username").Value;
            User user = _context.Users.First(u => u.Username == claim.ToString());

            Planet planet = _context.Planets.FirstOrDefault(u => u.Uid == user.Id);
            List<Shipclass> shipclasses = ShipController.LoadShipClasses();

            UpdateShipyardQueue(planet.Id);
            ShipExistanceCheck(ship);

            var shipDB = _context.Ships.FirstOrDefault(s =>s.Classid ==ship.classId && s.Weapontype == ship.Weapontype && s.Defensetype == ship.Defensetype && s.Propulsiontype == ship.Propulsiontype);
            ResourceDTO price = ShipCost(shipDB);
            Resource planetResources = _context.Resources.FirstOrDefault(s => s.Pid == planet.Id);
            try
            {
                ResourceController.PayResources(price, planetResources);
                _context.Update(planetResources);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

            List<Shipyardqueue> playerQueue = _context.Shipyardqueues.Where(s => s.Pid == planet.Id).ToList();
            if (playerQueue.Count == 0)
            {
                var tmpQueue = new Shipyardqueue();
                tmpQueue.Pid = planet.Id;
                tmpQueue.Sid = shipDB.Id;
                tmpQueue.Done = DateTime.UtcNow
                    .Add(shipclasses
                    .FirstOrDefault(s => s.Id == ship.classId).Buildtime
                    .ToTimeSpan()-new TimeSpan(0,0,planet.Shipyardlvl*shipDB.Classid));
                _context.Shipyardqueues.Add(tmpQueue);
            }
            else
            {
                DateTime doneTime = playerQueue.Last().Done;
                doneTime += shipclasses.First(s => s.Id == ship.classId).Buildtime.ToTimeSpan();

                var tmpQueue = new Shipyardqueue();
                tmpQueue.Pid = planet.Id;
                tmpQueue.Sid = shipDB.Id;
                tmpQueue.Done = playerQueue.Last().Done
                    .Add(shipclasses
                    .FirstOrDefault(s => s.Id == ship.classId).Buildtime
                    .ToTimeSpan());
                _context.Shipyardqueues.Add(tmpQueue);
            }
            _context.SaveChanges();
            return Ok();
        }

        // Nem tudok hozzá tesztet írni, mert nincs külön repository layer :(
        public static void UpdateShipyardQueue(int planetId)
        {
            using var context = new galaxyContext(); 
            List<Fleet> currentFleets = context.Fleets.Where(fleet => fleet.Pid == planetId).ToList(); 
            List<Shipyardqueue> doneShips = context.Shipyardqueues.Where(shipyardqueue => shipyardqueue.Pid == planetId && shipyardqueue.Done <= DateTime.UtcNow).ToList(); 
            List<Fleet> addedFleets = new();
            foreach (Shipyardqueue doneShip in doneShips)
            {
                if (currentFleets.Exists(fleet => fleet.Sid == doneShip.Sid))
                {
                    Fleet updatedFleet = currentFleets.First(fleet => fleet.Sid == doneShip.Sid);
                    updatedFleet.Count++;
                    context.Update(updatedFleet);
                }
                else if (addedFleets.Exists(fleet => fleet.Sid == doneShip.Sid))
                {
                    addedFleets.First(fleet => fleet.Sid == doneShip.Sid).Count++;
                }
                else
                {
                    // Add new fleet to fleets
                    Fleet addedFleet = new()
                    {
                        Pid = planetId,
                        Sid = doneShip.Sid,
                        Count = 1
                    };

                    addedFleets.Add(addedFleet);
                }

                // Remove ship from queue
                context.Remove(doneShip);
            }

            foreach (Fleet addedFleet in addedFleets)
            {
                context.Fleets.Add(addedFleet);
            }

            context.SaveChanges();
        }

        public static void ShipExistanceCheck(ShipDTO ship)
        {
            using (var context = new galaxyContext())
            {
                if(!context.Ships.Any(s=>s.Classid == ship.classId && s.Weapontype==ship.Weapontype && s.Defensetype == ship.Defensetype && s.Propulsiontype == ship.Propulsiontype))
                {
                    Ship shipToAdd= new Ship();
                    shipToAdd.Classid = ship.classId;
                    shipToAdd.Weapontype = ship.Weapontype;
                    shipToAdd.Defensetype = ship.Defensetype;
                    shipToAdd.Propulsiontype = ship.Propulsiontype;
                    context.Ships.Add(shipToAdd);
                    context.SaveChanges();
                }
            }
        }
        private ResourceDTO ShipCost(Ship ship)
        {
            ResourceDTO price = new ResourceDTO();
            List<ShipEquipmentDTO> equipment = ShipController.LoadShipEquipment();
            List<Shipclass> shipclasses = ShipController.LoadShipClasses();
            int steelMultiplier = 100;
            int carbonMultiplier = 100;
            int gasMultiplier = 100;
            int uraniumMultiplier = 100;
            ShipEquipmentDTO selectedWeapon = equipment.FirstOrDefault(s=>s.Id == ship.Weapontype);
            ShipEquipmentDTO selectedDefense = equipment.FirstOrDefault(s => s.Id == ship.Defensetype);
            ShipEquipmentDTO selectedProp = equipment.FirstOrDefault(s => s.Id == ship.Propulsiontype);
            steelMultiplier = steelMultiplier + selectedWeapon.Steelmultiplier + selectedDefense.Steelmultiplier + selectedProp.Steelmultiplier;
            carbonMultiplier = carbonMultiplier + selectedWeapon.Carbonmultiplier + selectedDefense.Carbonmultiplier + selectedProp.Carbonmultiplier;
            gasMultiplier = gasMultiplier + selectedWeapon.Gasmultiplier + selectedDefense.Gasmultiplier + selectedProp.Gasmultiplier;
            uraniumMultiplier = uraniumMultiplier + selectedWeapon.Uraniummultiplier + selectedDefense.Uraniummultiplier + selectedProp.Uraniummultiplier;
            price.Steelcount = shipclasses.FirstOrDefault(s => s.Id == ship.Classid).Scost * steelMultiplier / 100;
            price.Carboncount = shipclasses.FirstOrDefault(s => s.Id == ship.Classid).Ccost * carbonMultiplier / 100;
            price.Gascount = shipclasses.FirstOrDefault(s => s.Id == ship.Classid).Gcost * gasMultiplier / 100;
            price.Uraniumcount = shipclasses.FirstOrDefault(s => s.Id == ship.Classid).Ucost * uraniumMultiplier / 100;
            return price;


        }
    }
}
