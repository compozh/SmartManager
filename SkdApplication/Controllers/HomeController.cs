using Microsoft.AspNetCore.Mvc;

namespace Vue2Spa.Controllers
{
    public class HomeController : Controller
    {
        //TODO: route ("/, 
        public IActionResult Index()
        {
            // TODO: проверка что залогинены (session ticket != null)
            // TODO: если ок, то SKDLogic.GetUsers

            return View();
        }

        public IActionResult Error()
        {
            return View();
        }


        // TODO: Action Login
        // new CallWebReq().Login(login, password);
        // save user info to Session (pass,ticket, login)
    }
}
