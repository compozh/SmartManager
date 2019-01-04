using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Vue2Spa.Models;
using Vue2Spa.Services.CallWeb;
using Vue2Spa.Services.Logic;
using Microsoft.Extensions.DependencyInjection;

namespace Vue2Spa.Controllers
{
    [Route("api/[controller]")]
    public class SkdApiController : Controller
    {
        //private readonly ISKDLogic _skdLogic;
        private readonly IServiceProvider  _provider;
        private IWebRequestsTools _iWebRequest { get { return _provider.GetService<IWebRequestsTools>(); } }//сокращаем
        // сокращаем
        private ISKDLogic _iSKDLogic { get { return _provider.GetService<ISKDLogic>(); } }
        //нужно добиться того, чтобы убрать эти интерфейсы

        public SkdApiController( /*ISKDLogic skdLogic*/ IServiceProvider provider)
        {
            this._provider = provider;
        }
        private bool InternalLogin(string login, string password)
        {
            string userJson = _iWebRequest.Login(login, password);//приходит Json
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
        public object Login([FromQuery(Name = "login")] string login, [FromQuery(Name = "password")] string password)
        {
            if(InternalLogin(login, password)==true)
            {
                return JsonConvert.DeserializeObject<User>(HttpContext.Session.GetString("user"));
            }
            else
            {
                return "wrong";
            }
        }
        [HttpPost("[action]")]
        public object GetUsers()
        {
            //проверка на null не ест ьправильная, нужно будет сделать проверку на корректный логин и пароль
            if (string.IsNullOrEmpty(HttpContext.Session.Get<User>("user").Ticket))// или чему там равняется умершая сессия
            {
                return "login";
            }
            else
            {
                var users = _iSKDLogic.GetFullUsers(HttpContext.Session.Get<User>("user").Ticket);

                if (users == null)
                {
                    return Login(HttpContext.Session.GetString("login"), HttpContext.Session.GetString("password"));
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

