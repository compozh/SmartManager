using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace Web.Authentication
{

	[Route("api/[controller]")]
	public class AccountController : Controller
	{
		private readonly AuthenticationTools _auth;

		public AccountController(AuthenticationTools auth)
		{
			_auth = auth;
		}


		[HttpPost("[action]")]
		public async Task Login([FromBody]AuthData user)
		{
			var response = _auth.Login(user);
			if (!response.Result)
			{
				Response.StatusCode = 400;
				await Response.WriteAsync(response.Message);
				return;
			}

			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(response.Message);
		}
	}
}
