using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkdLogic.Models;
using Web.WebRequests;

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
		
		private async Task<string> getUserInfoAsync(IEnumerable<AllUserInfo> result)
		{
			var calcId = "GETUSERSINFO";
			var temp = result.Select(x => new { USERID = x.UserID, HASH = "" });
			var args = JsonConvert.SerializeObject(new { Users = temp, ByLogin = false, SaveInContent = true });
			return await _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
		}
		//метод получения фото для всех пользователей 
		private async Task<string> getUsersAsync()
		{
			var calcId = "_SKD_STATE";
			var args = "{\\\"SecretPhrase\\\":\\\"291263\\\"}";
			return await _webRequestsTools.CallWebRequestAsync(calcId, args); //достаю объект из IServiceProvider
		}

		/// <summary>
		/// Получение готового списка пользователей
		/// </summary>
		/// <param name="ticket">ticket с сервера приложений</param>
		/// <returns></returns>
		public async Task<IEnumerable<AllUserInfo>> GetFullUsersAsync()//тикет пришедший из сессии
		{
			var users = JsonConvert.DeserializeObject<List<AllUserInfo>>(await getUsersAsync());//при логине отправляю тикет на получение всех пользователей
			var userInfo = JsonConvert.DeserializeObject<List<UserInfo>>(await getUserInfoAsync(users));//при логине отправляю тикет на получение информации пользователей

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
