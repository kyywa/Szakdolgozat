using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SpaceAPI.Models;
using SpaceAPI.Models.DTOs;
using System.IdentityModel.Tokens.Jwt;

namespace SpaceAPI.Controllers
{
    [Route("api/[controller]/[action]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly galaxyContext _context;
        public MessagesController(galaxyContext context)
        {
            _context = context;
        }
        [HttpGet, Authorize]
        public IActionResult GetAllMessages()
        {
            try
            {
                string username = User.Claims.First(c => c.Type == "username").Value;

                List<MessageWithUsernamesDTO> messages = _context.MessageWithUsernames
                    .FromSqlRaw(
                        @$"SELECT 
                            Receiver.username AS Receiver, 
                            Sender.username AS Sender, 
                            message.message AS Message, 
                            message.receiverdeleted AS IsReceiverDeleted,
                            message.senderdeleted AS IsSenderDeleted,
                            message.date AS Date 
                        FROM message
                        LEFT JOIN user AS Sender ON message.senderid = Sender.id 
                        LEFT JOIN user AS Receiver ON message.recieverid = Receiver.id
                        WHERE Sender.username='{username}' OR Receiver.username='{username}';"
                    )
                    .AsEnumerable()
                    .Where(message => !message.IsSenderDeleted && message.Sender == username || !message.IsReceiverDeleted && message.Receiver == username)
                    .Select(message => new MessageWithUsernamesDTO
                    {
                        Receiver = message.Receiver,
                        Sender = message.Sender,
                        Message = message.Message,
                        Date = message.Date.ToString("o") + "Z",
                    })
                    .ToList();

                return Ok(messages);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpPost, Authorize]
        public async Task<IActionResult> CreateMessage(NewMessageDTO message)
        {
            try
            {
                string username = User.Claims.First(c => c.Type == "username").Value;

                if (username.Trim().ToLower() == message.Receiver.Trim().ToLower())
                {
                    return BadRequest("You can't send message to you.");
                }

                int senderId = _context.Users.First(user => user.Username == username).Id;
                int receiverId = _context.Users.First(user => user.Username == message.Receiver).Id;

                DateTime createDate = DateTime.UtcNow;

                Message newMessage = new()
                {
                    Senderid = senderId,
                    Senderdeleted = false,
                    Recieverid = receiverId,
                    Receiverdeleted = false,
                    Date = createDate,
                    MessageBody = message.Message
                };

                _context.Messages.Add(newMessage);
                await _context.SaveChangesAsync();

                MessageWithUsernamesDTO messageWithUsernames = new()
                {
                    Sender = username,
                    Receiver = message.Receiver,
                    Message = message.Message,
                    Date = createDate.ToString("o"),
                };

                return Ok(messageWithUsernames);
            }
            catch (InvalidOperationException)
            {
                return BadRequest("No user with this username.");
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }

        [HttpDelete, Authorize]
        public async Task<IActionResult> DeleteConversation(string partnerUsername)
        {
            try
            {
                string username = User.Claims.First(c => c.Type == "username").Value;
                
                int userId = _context.Users.First(user => user.Username == username).Id;
                int partnerId = _context.Users.First(user => user.Username == partnerUsername).Id;

                List<Message> messagesWhereUserIsSender = await _context.Messages
                    .Where(message => message.Senderid == userId && message.Recieverid == partnerId)
                    .ToListAsync();

                List<Message> messagesWhereUserIsReceiver = await _context.Messages
                    .Where(message => message.Recieverid == userId && message.Senderid == partnerId)
                    .ToListAsync();

                foreach(var message in messagesWhereUserIsSender)
                {
                    message.Senderdeleted = true;
                    _context.Messages.Update(message);
                }

                foreach(var message in messagesWhereUserIsReceiver)
                {
                    message.Receiverdeleted = true;
                    _context.Messages.Update(message);
                }

                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception ex)
            {
                return BadRequest(ex.ToString());
            }
        }
    }
}
