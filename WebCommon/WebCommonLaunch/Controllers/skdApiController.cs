using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkdLogic.Models;
using Web.WebRequests;
using Web.Authentication;
using Web.Tools;

namespace SkdLogic.Controllers
{
	[Route("api/[controller]")]
	public class SkdApiController : Controller
	{
		private readonly AuthenticationTools _authenticateTools;

		private readonly SkdLogic _skdLogic;

		public SkdApiController(SkdLogic skdLogic, AuthenticationTools authenticateTools)
		{
			_skdLogic = skdLogic;
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

			return null;
		}
	}
}

