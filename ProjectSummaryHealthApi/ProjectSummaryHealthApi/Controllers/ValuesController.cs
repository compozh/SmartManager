using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization.Json;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using ProjectSummaryHealthApi.Logic;
using Web.Authentication;
using Web.Tools;
//using Web.WebRequests;
namespace ProjectSummaryHealthApi.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	[EnableCors("MyPolicy")]
	public class ValuesController : ControllerBase
	{
		private readonly AuthenticationTools _auth;
		private readonly HealthSummaryLogic _healthSummary;
		//private readonly AuthenticationTools _authenticateTools;
		public ValuesController(AuthenticationTools auth, HealthSummaryLogic healthSummary)
		{
			_auth = auth;
			_healthSummary = healthSummary;
			//_authenticateTools = authenticateTools;
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
			var data = new {
				user = myuser.UserName,
				message = response.Message
			};
			
			
			string json = JsonConvert.SerializeObject(data);
			// сериализация ответа
			Response.ContentType = "application/json";
			await Response.WriteAsync(json);
		}

		[HttpGet("[action]")]
		public string get(string input)
		{
			var session = HttpContext.Session;
			if (session != null)
			{
				if (session.GetString("Time") == null)
				{
					session.SetString("Time",DateTime.Now.ToString()) ;
				}
				return "Session Time: " + session.GetString("Time") + input;
			}
			return "Session is not availabe" + input;
		}



		[Authorize]
		[HttpPost("[action]")]
		public async Task<string> GetInfoAboutServer(string date)
		{
			var response = await _healthSummary.getInfoAboutServerAsync(date);
			if (response != null)
			{
				return response;
			}
			return null;
		}
		[Authorize]
		[HttpPost("[action]")]
		public async Task<string> GetDetailInformation(string criterion, string date, string parameters)
		{
			var response = await _healthSummary.getDetailInformationAsync(criterion, date, parameters);
			if (response != null)
			{
				return response;
			}
			return null;
		}
	}
}
