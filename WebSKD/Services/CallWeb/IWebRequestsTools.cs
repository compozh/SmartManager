using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vue2Spa.Services.CallWeb
{
    public interface IWebRequestsTools
    {
        string Login(string login, string password);
        string CallWebRequest(string calcId, string args, string ticket);
    }
}
