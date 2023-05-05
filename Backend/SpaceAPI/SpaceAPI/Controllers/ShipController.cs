using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;
using System.Text.Json;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class ShipController : ControllerBase
    {
        private readonly galaxyContext _context;
        public ShipController(galaxyContext context)
        {
            _context = context;
        }

        [HttpGet, Authorize]
        public ActionResult<ShipDisplayDTO> GetShipById(int id)
        {
            try
            {
                Ship ship = _context.Ships.First(ship => ship.Id == id);

                List<ShipEquipmentDTO> equipment = LoadShipEquipment();
                Shipclass shipClass = LoadShipClasses().First(shipClass => shipClass.Id == ship.Classid);

                string weaponType = equipment.First(equipment => equipment.Id == ship.Weapontype).Name;
                string defenseType = equipment.First(equipment => equipment.Id == ship.Defensetype).Name;
                string propulsionType = equipment.First(equipment => equipment.Id == ship.Propulsiontype).Name;

                ShipDisplayDTO shipToDisplay = new()
                {
                    Name = shipClass.Name,
                    Type = shipClass.Type,
                    WeaponType = weaponType,
                    DefenseType = defenseType,
                    PropulsionType = propulsionType,
                    BaseAttack = shipClass.Baseattack,
                    BaseDefense = shipClass.Basedefense,
                    BaseSpeed = shipClass.Basespeed,
                    PopCost = shipClass.Popcost
                };

                return Ok(shipToDisplay);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        public static ShipStatDTO GetShipStats(int classId)
        {
            var shipClass = LoadShipClasses()
                .First(sc => sc.Id == classId);
            return new ShipStatDTO
            {
                attack = shipClass.Baseattack,
                defense = shipClass.Basedefense,
                speed = shipClass.Basespeed
            };
        }

        public static List<Shipclass> LoadShipClasses()
        {
            StreamReader sr = new StreamReader("Data/Settings/shipclass.json");
            string json = sr.ReadToEnd();
            List<Shipclass> shipclasses = JsonSerializer.Deserialize<List<Shipclass>>(json);
            sr.Close();
            return shipclasses;
        }

        public static List<ShipEquipmentDTO> LoadShipEquipment()
        {
            StreamReader sr = new StreamReader("Data/Settings/shipequipmentcost.json");
            string json = sr.ReadToEnd();
            List<ShipEquipmentDTO> equipment = JsonSerializer.Deserialize<List<ShipEquipmentDTO>>(json);
            sr.Close();
            return equipment;
        }
    }
}
