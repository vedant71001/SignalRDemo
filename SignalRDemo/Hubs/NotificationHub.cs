using Microsoft.AspNetCore.SignalR;
using SignalRDemo.Models;

namespace SignalRDemo.Hubs
{
    public class NotificationHub : Hub
    {
        public override Task OnConnectedAsync()
        {
            ConnectedUsers.Ids.Add(Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception? exception)
        {
            ConnectedUsers.Ids.Remove(Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
