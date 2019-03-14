using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Web.Authentication;
using Web.Tools;

namespace SmartManagerApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("MyPolicy")]
	public class CoreController : ControllerBase
	{
		private readonly AuthenticationTools _auth;
		public CoreController(AuthenticationTools auth)
		{
			_auth = auth;
		}

		// GET api/values
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

			var myUser = SessionHandler.Current.GetCurrentUser();
			var data = new
			{
				user = myUser.UserName,
				message = response.Message
			};

			string json = JsonConvert.SerializeObject(data);
			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(json);
		}
		
		[HttpPost("[action]")]
		public string GetAppData()
		{
			return System.IO.File.ReadAllText("./MockData/app.data.json");		
		}

		[HttpPost("[action]")]
		public string GetAppLayout()
		{
			return System.IO.File.ReadAllText("./MockData/app.json");
		}
		
		
		[HttpPost("[action]")]
		public string CallAction(ActionArguments actionArgumentsArguments)
		{
			
			System.Threading.Thread.Sleep(2000);
			return "TEST";
		}
		
		// GET api/values/5
		[HttpGet("{id}")]
		public ActionResult<string> Get(int id)
		{
			return "value";
		}
	}


	public class ActionArguments
	{
		public string Source { get; set; }
		public string Event { get; set; }
		public Dictionary<string, object> Arguments { get; set; }
	}

}
