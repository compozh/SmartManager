using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SkdLogic.Models;

namespace SkdLogic.Controllers
{
	[Route("api/[controller]")]
	public class SkdApiController : Controller
	{
		// сокращаем
		private readonly SkdLogic _skdLogic;
		//нужно добиться того, чтобы убрать эти интерфейсы

		public SkdApiController(SkdLogic skdLogic)
		{
			_skdLogic = skdLogic;
		}


		[Authorize]
		[HttpPost("[action]")]
		public async Task<IEnumerable<AllUserInfo>> GetUsers()
		{
			var response = await _skdLogic.GetFullUsersAsync();
			return response;
		}
	}
}
