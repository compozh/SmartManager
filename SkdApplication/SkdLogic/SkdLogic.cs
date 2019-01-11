using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkdLogic.Models;
using WebRequests;

namespace SkdLogic
{
	public class SkdLogic
	{
		// не очень нравиться что в конструкторе
		public SkdLogic(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;			
		}
		
		private readonly WebRequestsTools _webRequestsTools;
		
		private async Task<string> GetUserInfoAsync(IEnumerable<AllUserInfo> result, string ticket)
		{
			string calcId = "GETUSERSINFO";
			var temp = result.Select(x => new { USERID = x.UserID, HASH = "" });
			string args = JsonConvert.SerializeObject(new { Users = temp, ByLogin = false, SaveInContent = true });
			return await _webRequestsTools.CallWebRequestAsync(calcId, args, ticket);//достаю объект из IServiceProvider
		}
		//метод получения фото для всех пользователей 
		private async Task<string> GetUsersAsync(string ticket)
		{
			string calcId = "_SKD_STATE";
			string args = "{\\\"SecretPhrase\\\":\\\"291263\\\"}";
			return await _webRequestsTools.CallWebRequestAsync(calcId, args, ticket); //достаю объект из IServiceProvider
		}

		/// <summary>
		/// Получение готового списка пользователей
		/// </summary>
		/// <param name="ticket">ticket с сервера приложений</param>
		/// <returns></returns>
		public async Task<IEnumerable<AllUserInfo>> GetFullUsersAsync(string ticket)//тикет пришедший из сессии
		{
			IEnumerable<AllUserInfo> users = JsonConvert.DeserializeObject<IEnumerable<AllUserInfo>>(await GetUsersAsync(ticket));//при логине отправляю тикет на получение всех пользователей
			IEnumerable<UserInfo> userInfo = JsonConvert.DeserializeObject<IEnumerable<UserInfo>>(await GetUserInfoAsync(users, ticket));//при логине отправляю тикет на получение информации пользователей

			//_context.Session.Get("user");
			//foreach (var i in users)
			//{
			//    i.Photo= "https://m.it.ua/ws/GetFile.ashx?file="+userInfo.Where(x => x.UserID == i.UserID).Select(x => x.Photo).FirstOrDefault()+ "&folder=content&nodownload=1";
			//}
			//??  все еще под вопросом производительности
			var superUser = users.Zip(userInfo, (u, i) => new AllUserInfo
			{
				UserID = u.UserID,
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
