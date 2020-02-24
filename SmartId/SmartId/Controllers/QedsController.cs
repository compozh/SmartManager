using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Hosting;
using IdentityServer4.Quickstart.UI;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using SmartId.ViewModels;
using SmartId.Extensions;
using Shared.DigitalSignature;
using System.IO;
using Microsoft.AspNetCore.WebUtilities;

namespace SmartId.Controllers
{
    [SecurityHeaders]
    [AllowAnonymous]
    public class QedsController : Controller
    {
		private IWebHostEnvironment _environment { get; }
		public QedsController(IWebHostEnvironment environment)
		{
			_environment = environment;
		}

		[HttpGet]
		public ActionResult Sign(string data = null, string state = null, string returnUrl = null)
		{
			if (string.IsNullOrWhiteSpace(returnUrl) || !Url.IsLocalUrl(returnUrl))
			{
				return new RedirectResult("~/", false);
			}
			if (string.IsNullOrWhiteSpace(data))
			{
				return new RedirectResult(returnUrl, false);
			}
			HttpContext.SetAllowFrame();
			var model = new DigitalSignatureViewModel
			{
				SiteRoot = Url.Content("~"),
				Language = Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName.ToLower(),
				AllowStore = false,
				AllowStoreLocal = false,
				DebugMode = _environment.IsDevelopment(),
				InitialData = data,
				State = state,
				ReturnUrl = returnUrl
			};
			return View(model);
		}
	}
}