using System;
using System.Threading.Tasks;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using SkdLogic.Models;
using WebRequests;
using Microsoft.Extensions.DependencyInjection;

namespace SkdLogic.Controllers
{
    [Route("api/[controller]")]
    public class SkdApiController : Controller
    {
		private readonly WebRequestsTools _webRequestTools;
		// сокращаем
		private readonly SkdLogic _skdLogic;
        //нужно добиться того, чтобы убрать эти интерфейсы

        public SkdApiController(SkdLogic skdLogic, WebRequestsTools webRequestTools)
        {
			_skdLogic = skdLogic;
			_webRequestTools = webRequestTools;
		}
        private async Task<bool> internalLoginAsync(string login, string password)
        {
            string userJson = await _webRequestTools.LoginAsync(login, password);//приходит Json
            var user = JsonConvert.DeserializeObject<User>(userJson);
            if(user.Success==true)
            {
                HttpContext.Session.Set("user", user);
                HttpContext.Session.SetString("ticket", user.Ticket);
                HttpContext.Session.SetString("login", login);
                HttpContext.Session.SetString("password", password);
                return true;
            }
            else
            {
                return false;
            }
        }
        // подумать, стоит ли записать тикет, логи и пароль не в методе сервиса "Login"
        [HttpPost("[action]")]
        public async Task<object> LoginAsync([FromQuery(Name = "login")] string login, [FromQuery(Name = "password")] string password)
        {
            if (await internalLoginAsync(login, password) == true)
            {
                return JsonConvert.DeserializeObject<User>(HttpContext.Session.GetString("user"));
            }
            else
            {
                return "wrong";
            }
        }
        [HttpPost("[action]")]
        public async Task<object> GetUsers()
        {
            //проверка на null не ест ьправильная, нужно будет сделать проверку на корректный логин и пароль
            if (string.IsNullOrEmpty(HttpContext.Session.Get<User>("user").Ticket))// или чему там равняется умершая сессия
            {
                return "login";
            }
            else
            {
                var users = await _skdLogic.GetFullUsersAsync(HttpContext.Session.Get<User>("user").Ticket);

                if (users == null)
                {
                    return await LoginAsync(HttpContext.Session.GetString("login"), HttpContext.Session.GetString("password"));
                }
                else { 
                    return users;
                }
            }
        }
    }


    public static class SessionExtensions
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, JsonConvert.SerializeObject(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default(T) : JsonConvert.DeserializeObject<T>(value);
        }
    }

}

