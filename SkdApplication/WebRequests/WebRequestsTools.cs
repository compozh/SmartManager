using Newtonsoft.Json;
using System.Collections.Generic;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace WebRequests
{
	//в дальнейшем пойдёт в отдельную либу
	public class WebRequestsTools
	{
		private readonly IHttpClientFactory _clientFactory;
		
		public WebRequestsTools(System.Net.Http.IHttpClientFactory clientFactory)
		{
			_clientFactory = clientFactory;
		}

        //метод на авторизацию
        public async Task<string> LoginAsync(string login, string password)
        {
			var client = _clientFactory.CreateClient();
			var request = new HttpRequestMessage(HttpMethod.Post,
			"http://m.it.ua/ws/WebService.asmx/Loginex");
			request.Headers.Add("Data-Type", "json");
			request.Content = new StringContent($"{{login:'{login}', password:'{password}'}}", Encoding.UTF8, "application/json");
			var response = await client.SendAsync(request);
			var content = await response.Content.ReadAsStringAsync();
			var valuesUser = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
            string valueUser;
            valuesUser.TryGetValue("d", out valueUser);
            return valueUser;
        }
        //метод на достать другие данные
        public async Task<string> CallWebRequestAsync(string calcId, string args, string ticket)
        {
			var client = _clientFactory.CreateClient();
			var request = new HttpRequestMessage(HttpMethod.Post,
			"http://m.it.ua/ws/WebService.asmx/ExecuteEx");
			request.Headers.Add("Data-Type", "json");
			request.Content = new StringContent($"{{calcId:'{calcId}', args:'{args}', ticket:'{ticket}'}}", Encoding.UTF8, "application/json");
			var response = await client.SendAsync(request);
			var content = await response.Content.ReadAsStringAsync();
			var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(content);
            string value;
            values.TryGetValue("d", out value);
            return value;
        }
    }
}

