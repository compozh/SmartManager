using Newtonsoft.Json;
using RestSharp;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vue2Spa.Services.CallWeb
{
    //в дальнейшем пойдёт в отдельную либу
    public class WebRequestsTools :IWebRequestsTools{
        //private string _ticket;// нужда в тикете отпадает

        //метод на авторизацию
        public string Login(string login, string password)
        {
            var client = new RestClient("http://m.it.ua/ws/WebService.asmx/Loginex");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Data-Type", "json");
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("undefined", "{login: '" + login + "',password:\"" + password + "\"}\n", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            var valuesUser = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);
            string valueUser;
            valuesUser.TryGetValue("d", out valueUser);
            return valueUser;
        }
        //метод на достать другие данные
        public string CallWebRequest(string calcId, string args, string ticket)
        {
            var client = new RestClient("http://m.it.ua/ws/WebService.asmx/ExecuteEx");
            var request = new RestRequest(Method.POST);
            request.AddHeader("Data-Type", "json");
            request.AddHeader("Content-Type", "application/json");
            request.AddParameter("undefined", "{calcId: '" + calcId + "',args: \'" + args + "\',ticket: \"" + ticket + "\"}", ParameterType.RequestBody);
            IRestResponse response = client.Execute(request);
            var values = JsonConvert.DeserializeObject<Dictionary<string, string>>(response.Content);
            string value;
            values.TryGetValue("d", out value);
            return value;
        }
    }
}

