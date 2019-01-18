using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.Linq;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SkdLogic.Models;
using WebRequests;
using Microsoft.Extensions.DependencyInjection;
using WebRequests.Models;
using WebTools;

namespace SkdLogic.Controllers
{
	[Route("api/[controller]")]
	public class SkdApiController : Controller
	{
		private readonly WebRequestsTools _webRequestTools;

		// сокращаем
		private readonly SkdLogic _skdLogic;
		//нужно добиться того, чтобы убрать эти интерфейсы

		public SkdApiController(SkdLogic skdLogic, WebRequestsTools webRequestTools)
		{
			_skdLogic = skdLogic;
			_webRequestTools = webRequestTools;
		}
		
	
		[Authorize]
		[HttpPost("[action]")]
		public async Task<object> GetUsers()
		{
		
			var users = await _skdLogic.GetFullUsersAsync();

			return users;
		}
	}
}

