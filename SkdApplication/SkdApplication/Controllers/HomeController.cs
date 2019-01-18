using Microsoft.AspNetCore.Mvc;
namespace SkdApplication.Controllers
{
    public class HomeController : Controller
    {
        public IActionResult Index()
        {
            return View("/Views/Index.cshtml");
        }
    }
}
