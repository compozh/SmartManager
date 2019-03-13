using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using SkdLogic.Models;
using Web.Authentication;
using Web.Tools;
using Web.WebRequests;

namespace SkdLogic
{
	public class SkdLogic
	{
		// не очень нравиться что в конструкторе
		public SkdLogic(WebRequestsTools webRequestsTools, AuthenticationTools authenticateTools)
		{
			_webRequestsTools = webRequestsTools;
			_authenticateTools = authenticateTools;
		}
		private readonly AuthenticationTools _authenticateTools;

		private readonly WebRequestsTools _webRequestsTools;
		
		private async Task<List<UserInfo>> getUserInfoAsync(IEnumerable<AllUserInfo> result)
		{
			var calcId = "GETUSERSINFO";
			var temp = result.Select(x => new { USERID = x.UserID, HASH = "" });
			var args = JsonConvert.SerializeObject(new { Users = temp, ByLogin = false, SaveInContent = true });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<UserInfo>>(requestResult.Content);

			}
		}
		
		//метод получения фото для всех пользователей
		private async Task<List<AllUserInfo>> getUsersAsync()
		{
			var calcId = "_SKD_STATE";
			var args = "{\"SecretPhrase\":\"291263\"}";

			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<AllUserInfo>>(requestResult.Content);

			}
		}

		/// <summary>
		/// Получение готового списка пользователей
		/// </summary>
		/// <returns></returns>
		public async Task<IEnumerable<AllUserInfo>> GetFullUsersAsync()
		{
			var users = await getUsersAsync();//при логине отправляю тикет на получение всех пользователей
			if (users == null)
			{
				return null;
			}
			var userInfo = await getUserInfoAsync(users);//при логине отправляю тикет на получение информации пользователей

			if (userInfo == null)
			{
				return null;
			}

			var user = SessionHandler.Current.GetCurrentUser();

			var superUser = users.Zip(userInfo, (u, i) => new AllUserInfo
			{
				UserID = u.UserID,
				FIO = u.FIO,
				Birthday = u.Birthday,
				Departament = u.Departament,
				Place = u.Place,
				SensorName = u.SensorName,
				HASKEY = u.HASKEY,
				Time = u.Time,
				MobileTel = u.MobileTel,
				Tel = u.Tel,
				Email = u.Email,
				Skype = u.Skype,
				Photo = "https://m.it.ua/ws/GetFile.ashx?file=" + i.Photo + "&folder=content&nodownload=1",
				IsCurrent = user?.UserId == u.UserID
			}).ToList();
			
			
			return superUser;
		}
	}
}
