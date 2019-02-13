using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkdLogic.Models;
using Web.WebRequests;
using Web.Authentication;

namespace SkdLogic.Controllers
{
	[Route("api/[controller]")]
	public class SkdApiController : Controller
	{
		private readonly WebRequestsTools _webRequestTools;
		private readonly AuthenticationTools _authenticateTools;

		// сокращаем
		private readonly SkdLogic _skdLogic;
		//нужно добиться того, чтобы убрать эти интерфейсы

		public SkdApiController(SkdLogic skdLogic, WebRequestsTools webRequestTools, AuthenticationTools authenticateTools)
		{
			_skdLogic = skdLogic;
			_webRequestTools = webRequestTools;
			_authenticateTools = authenticateTools;
		}


		[Authorize]
		[HttpPost("[action]")]
		public async Task<IEnumerable<AllUserInfo>> GetUsers()
		{
			var response = await _skdLogic.GetFullUsersAsync();
			if (response != null)
			{
				return response;
			}

			var authResult = await _authenticateTools.ReLogin(HttpContext);
			if (authResult.Result)
			{
				return await _skdLogic.GetFullUsersAsync();
			}

			return null;
		}
	}
}

