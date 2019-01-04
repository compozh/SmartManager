using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Vue2Spa.Models;
using Vue2Spa.Services.CallWeb;


namespace Vue2Spa.Services.Logic
{
    public class SKDLogic :ISKDLogic
    {
        // не очень нравиться что в конструкторе
        public SKDLogic(IServiceProvider provider/*,HttpContext context*/) {
            _provider = provider;
            //_context = context;
        }
        private IServiceProvider _provider;
        //private HttpContext _context;
        private IWebRequestsTools _iWebRequests { get { return _provider.GetService<IWebRequestsTools>(); } }
        // _provider.GetService<IWebRequestsTools>() без свояйства
        /// метод для получения всех пользователей
        ///

        ///
        private string GetUserInfo(IEnumerable<AllUserInfo> result, string ticket)
        {
            string calcId = "GETUSERSINFO";
            var temp = result.Select(x => new {
                USERID = x.UserID,
                HASH = ""
            });
           string args= JsonConvert.SerializeObject(new { Users = temp, ByLogin= false, SaveInContent = true });
            return _iWebRequests.CallWebRequest(calcId, args, ticket);//достаю объект из IServiceProvider
        }
        //метод получения фото для всех пользователей 
        private string GetUsers(string ticket)
        {
            string calcId = "_SKD_STATE";
            string args = "{\\\"SecretPhrase\\\":\\\"291263\\\"}";
            return _iWebRequests.CallWebRequest(calcId, args, ticket); //достаю объект из IServiceProvider
        }

        /// <summary>
        /// Получение готового списка пользователей
        /// </summary>
        /// <param name="ticket">ticket с сервера приложений</param>
        /// <returns></returns>
        public IEnumerable<AllUserInfo> GetFullUsers(string ticket)//тикет пришедший из сессии
        {
            IEnumerable<AllUserInfo> users = JsonConvert.DeserializeObject<IEnumerable<AllUserInfo>>(GetUsers(ticket));//при логине отправляю тикет на получение всех пользователей
            IEnumerable<UserInfo> userInfo = JsonConvert.DeserializeObject<IEnumerable<UserInfo>>(GetUserInfo(users, ticket));//при логине отправляю тикет на получение информации пользователей

            //_context.Session.Get("user");
            //foreach (var i in users)
            //{
            //    i.Photo= "https://m.it.ua/ws/GetFile.ashx?file="+userInfo.Where(x => x.UserID == i.UserID).Select(x => x.Photo).FirstOrDefault()+ "&folder=content&nodownload=1";
            //}
            //??  все еще под вопросом производительности
            var superUser = users.Zip(userInfo, (u, i) => new AllUserInfo
            {
                UserID=u.UserID,
                FIO = u.FIO,
                Birthday = u.Birthday,
                Departament = u.Departament,
                Place = u.Place,
                SensorName = u.SensorName,
                Time = u.Time,
                MobileTel = u.MobileTel,
                Tel = u.Tel,
                Email = u.Email,
                Skype = u.Skype,
                Photo = "https://m.it.ua/ws/GetFile.ashx?file=" + i.Photo + "&folder=content&nodownload=1"
            });
            return superUser;
        }
    }
}


//string calcId = "GETUSERSINFO";
//var temp = result.Select(x => new {
//    USERID = x.UserID,
//    HASH = ""
//});
//string args = JsonConvert.SerializeObject(new { Users = temp, ByLogin = false, SaveInContent = true });
////var test = from i in temp
////           select "{\"USERID\":\""+i.Id+"\", \"HASH\":\"\"},";
//////select string.Format("{{\"USERID\":\"{0}\", \"HASH\":\"\"}},",i.Id);
////string args = "{\"Users\":[";
////args += string.Join(null, test);
////args = args.Substring(0, args.Length - 1);
////args += "],\"ByLogin\":false,\"SaveInContent\":true}";
