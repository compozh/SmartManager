using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Web.WebRequests.Models;
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

			_login = login;
			_password = password;
			_ticket = user.Ticket;

			return user;

		}

		private string _login
		{
			get => SessionHandler.Current.Get<string>("UserName");
			set => SessionHandler.Current.Set("UserName", value);
		}
		private string _password
		{
			get => SessionHandler.Current.Get<string>("Password");
			set => SessionHandler.Current.Set("Password", value);
		}
        private string _ticket
		{
			get => SessionHandler.Current.Get<string>("Ticket");
			set => SessionHandler.Current.Set("Ticket", value);
		}
    
        //метод на достать другие данные
        public async Task<string> CallWebRequestAsync(string calcId, string args)
		{
			
			var content = await callWebRequestInternalAsync(calcId, args);

			if (content == WRONG_TICKET)
			{
				var user = await LoginAsync(_login, _password);
				if (!user.Success)
				{
					return null;
				}

				content = await callWebRequestInternalAsync(calcId, args);
			}
			
			
			var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
			values.TryGetValue("d", out var value);
            return value;
        }

		private async Task<string> callWebRequestInternalAsync(string calcId, string args)
		{
			var client = _clientFactory.CreateClient();
			var request = new HttpRequestMessage(HttpMethod.Post,
				"http://m.it.ua/ws/WebService.asmx/ExecuteEx");
			request.Headers.Add("Data-Type", "json");
			request.Content = new StringContent($"{{calcId:'{calcId}', args:'{args}', ticket:'{_ticket}'}}", Encoding.UTF8, "application/json");
			var response = await client.SendAsync(request);
			var content = await response.Content.ReadAsStringAsync();
			return content;
		}
	}
}

