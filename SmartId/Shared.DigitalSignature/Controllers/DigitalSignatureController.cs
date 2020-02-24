using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using Shared.WebExtensions;
using SmartId.Extensions;

namespace SmartId.Controllers
{
    [AllowAnonymous]
    public class DigitalSignatureController : Controller
    {
		public DigitalSignatureController()
		{
		}

		public ActionResult WebEds()
		{
			//TODO: Скрипты ЭЦП небезопасные!!
			HttpContext.SetScryptUnsafeMode();
			HttpContext.SetAllowFrame();
			return View();
		}

		public ActionResult SignAgentEds()
		{
			//TODO: Скрипты ЭЦП небезопасные!!
			HttpContext.SetScryptUnsafeMode();
			HttpContext.SetAllowFrame();
			return View();
		}
	}
}