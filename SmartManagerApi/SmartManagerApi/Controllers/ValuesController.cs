using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SmartManagerApi.Logic;
using Web.Authentication;
using Web.Tools;
using System;
using System.IO;
using System.Collections.Generic;

namespace SmartManagerApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("MyPolicy")]
	public class ValuesController : ControllerBase
	{
		private readonly AuthenticationTools _auth;
		private readonly SmartManagerLogic _smartManagerLogic;
		public ValuesController(AuthenticationTools auth, SmartManagerLogic smartManagerLogic)
		{
			_auth = auth;
			_smartManagerLogic = smartManagerLogic;
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

			var myuser = SessionHandler.Current.GetCurrentUser();
			var data = new
			{
				user = myuser.UserName,
				message = response.Message
			};


			string json = JsonConvert.SerializeObject(data);
			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(json);
		}
		[Authorize]
		[HttpPost("[action]")]
		public async Task<object> GetControls()
		{
			var response = await _smartManagerLogic.GetControls();
			if (response != null)
			{
				using (StreamReader r = new StreamReader("wwwroot\\testDataControls\\controls.json"))
				{
					string jsons = r.ReadToEnd();
					var items = JsonConvert.DeserializeObject<object>(jsons);
					return items;
				}
				//return response;
			}
			return null;
		}

		[Authorize]
		[HttpPost("[action]")]
		public async Task<object> GetToolbar()
		{
			using (StreamReader r = new StreamReader("wwwroot\\testDataControls\\toolbar.json"))
			{
				string jsons = r.ReadToEnd();
				var items = JsonConvert.DeserializeObject<object>(jsons);
				return items;
			}
		}
		// GET api/values/5
		[HttpGet("{id}")]
		public ActionResult<string> Get(int id)
		{
			return "value";
		}
	}

}
