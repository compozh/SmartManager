using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Web.Authentication;
using Web.Tools;

namespace Web.WebRequests
{
	//в дальнейшем пойдёт в отдельную либу
	public class WebRequestsTools
	{
		private readonly IHttpClientFactory _clientFactory;
		
		public WebRequestsTools(IHttpClientFactory clientFactory)
		{
			_clientFactory = clientFactory;
		}

		private const string WRONG_TICKET = "WRONG_TICKET";
		private const string NOT_AUTHORISED = "NOT_AUTHORISED";
		
        /// <summary>
        /// Авторизация через Web расчеты
        /// </summary>
        /// <param name="login">Имя пользователя</param>
        /// <param name="password">Пароль</param>
        /// <returns></returns>
        public async Task<User> LoginAsync(string login, string password)
        {
			var client = _clientFactory.CreateClient();
			var request = new HttpRequestMessage(HttpMethod.Post,
			"http://m.it.ua/ws/WebService.asmx/Loginex");
			request.Headers.Add("Data-Type", "json");
			request.Content = new StringContent($"{{login:'{login}', password:'{password}'}}", Encoding.UTF8, "application/json");
			var response = await client.SendAsync(request);
			var content = await response.Content.ReadAsStringAsync();	
			
			var valuesUser = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
			valuesUser.TryGetValue("d", out var valueUser);
			var user = JsonConvert.DeserializeObject<User>(valueUser);
			
			_ticket = user.Ticket;

			return user;

		}

        private string _ticket
		{
			get => SessionHandler.Current.Get<string>("Ticket");
			set => SessionHandler.Current.Set("Ticket", value);
		}
    
        //метод на достать другие данные
        public async Task<WebRequestResult> CallWebRequestAsync(string calcId, string args)
		{
			var result = new WebRequestResult();
			var content = await callWebRequestInternalAsync(calcId, args);
			switch (content)
			{
				case WRONG_TICKET:
					result.ResultFlag = WebRequestsResponseFlags.WrongTicket;
					return result;
				case NOT_AUTHORISED:
					result.ResultFlag = WebRequestsResponseFlags.NotAuthorised;
					return result;
				default:
					result.ResultFlag = WebRequestsResponseFlags.Ok;
					var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
					values.TryGetValue("d", out var value);
					result.Content = value;
					return result;	
			}
			
        }

		private async Task<string> callWebRequestInternalAsync(string calcId, string args)
		{
			if (string.IsNullOrEmpty(_ticket))
			{
				return NOT_AUTHORISED;
			}
			var client = _clientFactory.CreateClient();
			var request = new HttpRequestMessage(HttpMethod.Post,"http://m.it.ua/ws/WebService.asmx/ExecuteEx");
			request.Headers.Add("Data-Type", "json");
			request.Content = new StringContent($"{{calcId:'{calcId}', args:'{args}', ticket:'{_ticket}'}}", Encoding.UTF8, "application/json");
			var response = await client.SendAsync(request);
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}
	}
	
	public enum WebRequestsResponseFlags{
		Ok,
		WrongTicket,
		NotAuthorised
	}

	public class WebRequestResult
	{
		public WebRequestsResponseFlags ResultFlag { get; set; }
		public string Content { get; set; }
	}
}

