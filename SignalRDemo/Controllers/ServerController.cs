using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Hubs;
using SignalRDemo.Models;

namespace SignalRDemo.Controllers
{
    public class ServerController : Controller
    {
        private readonly IHubContext<NotificationHub> _notificationHub;

        public ServerController(IHubContext<NotificationHub> notificationHub)
        {
            _notificationHub = notificationHub;
        }

        [HttpGet]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Index(Notification model)
        {
            await _notificationHub.Clients.All.SendAsync("ServerToClient", model.Message);
            return View();
        }

        public async Task<IActionResult> SendAudio(string audio)
        {

            await _notificationHub.Clients.All.SendAsync("ServerToClientAudio", audio);
            return Ok();
        }
    }
}
