using Microsoft.AspNetCore.Mvc;

namespace Web.DigitalSignature.Controllers
{
	public class DigitalSignatureController : Controller
	{
		public ActionResult WebEds()
		{
			// ReSharper disable once Mvc.ViewNotResolved
			return View("Pages\\DigitalSignature\\WebEds.cshtml");
		}

		public ActionResult SignAgentEds()
		{
			// ReSharper disable once Mvc.ViewNotResolved
			return View("Pages\\DigitalSignature\\SignAgentEds.cshtml");
		}
	}
}