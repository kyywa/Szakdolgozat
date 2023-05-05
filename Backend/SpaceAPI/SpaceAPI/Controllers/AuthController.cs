using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using SpaceAPI.Models;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Linq;
using Microsoft.AspNetCore.Identity;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public IConfiguration _configuration;
        //Config
        public AuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }
        //Register
        [HttpPost]
        public async Task<ActionResult> Register(UserDTORegister request)
        {
            User user = new User();
            CreatePasswordHash(request.Password, out byte[] pwHash, out byte[] pwSalt);
            user.Username = request.UserName;
            user.EMail = request.EMail;
            user.PWHash = pwHash;
            user.PWSalt = pwSalt;
            using(var context = new galaxyContext())
            {
                try
                {
                    context.Users.Add(user);
                    context.SaveChanges();
                    return Ok();
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
                
            }
            
        }
        //Login
        [HttpPost]
        public async Task<ActionResult<string>> Login(UserDTO request)
        {
            using (var context = new galaxyContext())
            {
                var user = context.Users.FirstOrDefault(s => s.EMail == request.EMail); 
                if (user == null) return BadRequest("Incorrect E-mail or password");
                if (!VerifyPassowrdHash(request.Password, user.PWHash, user.PWSalt)) return BadRequest("Incorrect E-mail or password");
                string token = CreateToken(user);
                return Ok(token);
            }
        }
        //Forgotten password
        [HttpPut]
        public async Task<ActionResult<string>> ForgottenPassword(string email)
        {
            using (var context = new galaxyContext())
            {
                var user = context.Users.FirstOrDefault(s => s.EMail == email);
                if (user == null) return Ok("");
                else
                {
                    Random r = new Random();
                    const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    string tmpPassord = "";
                    for (int i = 0; i < 10; i++)
                    {
                        tmpPassord += chars[r.Next(chars.Length)];
                    }
                    CreatePasswordHash(tmpPassord, out byte[] pwHash, out byte[] pwSalt);
                    user.PWHash = pwHash;
                    user.PWSalt = pwSalt;
                    try
                    {
                        context.Users.Add(user);
                        context.SaveChanges();
                        return Ok("Registration successful, welcome " + user.Username.ToString());
                        //Email küldés valahova ide.
                    }
                    catch (Exception ex)
                    {
                        return BadRequest(ex.Message);
                    }

                }
            }
        }
        //Supporting functions
        private void CreatePasswordHash(string password, out byte[] pwHash, out byte[] pwSalt)
        {
            using(var hmac = new HMACSHA512())
            {
                pwSalt = hmac.Key;
                pwHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
        private string CreateToken(User user)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim("username", user.Username),
                new Claim("uid", user.Id.ToString()),
            };
            
            var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(_configuration.GetSection("Appsettings:Token").Value));
            
            var cred = new SigningCredentials(key,SecurityAlgorithms.HmacSha512Signature);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
                );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);
            return jwt;
        }
        private bool VerifyPassowrdHash(string password, byte[] pwHash, byte[] pwSalt)
        {
            using (var hmac = new HMACSHA512(pwSalt))
            {
                var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                return computedHash.SequenceEqual(pwHash);
            }
        }
        
    }
    
}
