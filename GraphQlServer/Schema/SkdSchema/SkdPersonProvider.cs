using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GraphQL.Types;
using Newtonsoft.Json;
using Web.Authentication;
using Web.Tools;
using Web.WebRequests;

namespace SkdSchema
{
	public interface ISkdPersonProvider
	{
		Task<IEnumerable<SkdPerson>> GetPersons(string userId);
		Task<IEnumerable<SkdPersonPhoto>> GetPersonsPhotos(IEnumerable<string> userIds);
		Task<SkdPersonPhoto> GetPersonPhoto(string userId);
	}

	
	public class SkdUserInfo
	{
		[JsonProperty("PHOTO")]
		public string Photo { get; set; }
		[JsonProperty("USERID")]
		public string UserID { get; set; }
	}
	
	public class SkdAllUserInfo
	{
		[JsonProperty("P_FIO")]
		public string FIO { get; set; }

		[JsonProperty("BIRTHDAY")]
		public string Birthday { get; set; }

		[JsonProperty("DEPARTMENT")]
		public string Departament { get; set; }

		[JsonProperty("PLACENAME")]
		public string Place { get; set; }

		[JsonProperty("H_NAME")]
		public string SensorName { get; set; }

		[JsonProperty("R_DT")]
		public string Time { get; set; }

		[JsonProperty("TEL")]
		public string MobileTel { get; set; }

		[JsonProperty("TEL2")]
		public string Tel { get; set; }

		[JsonProperty("EMAIL")]
		public string Email { get; set; }

		[JsonProperty("SKYPE")]
		public string Skype { get; set; }

		[JsonProperty("USERID")]
		public string UserID { get; set; }

		public string Photo { get; set; }
        
		[JsonProperty("IsCurrent")]
		public bool IsCurrent { get; set; }

		[JsonProperty("HASKEY")]
		public string HASKEY { get; set; }
	}
	
	public class SkdPersonProvider : ISkdPersonProvider
	{
		private readonly WebRequestsTools _webRequestsTools;

		public SkdPersonProvider(WebRequestsTools webRequestsTools)
		{
			_webRequestsTools = webRequestsTools;
		}
		private async Task<List<SkdUserInfo>> getUserInfoAsync(IEnumerable<string> userIds)
		{
			var calcId = "GETUSERSINFO";
			var temp = userIds.Select(x => new { USERID = x, HASH = "" });
			var args = JsonConvert.SerializeObject(new { Users = temp, ByLogin = false, SaveInContent = true });
			var task = _webRequestsTools.CallWebRequestAsync(calcId, args);//достаю объект из IServiceProvider
			var requestResult = await task;
			switch (requestResult.ResultFlag)
			{
				case WebRequestsResponseFlags.WrongTicket:
				case WebRequestsResponseFlags.NotAuthorised:
					return null;
				default:
					return JsonConvert.DeserializeObject<List<SkdUserInfo>>(requestResult.Content);

			}
		}

		//метод получени€ фото дл€ всех пользователей
		private async Task<List<SkdAllUserInfo>> getUsersAsync()
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
					return JsonConvert.DeserializeObject<List<SkdAllUserInfo>>(requestResult.Content);

			}
		}
		
		private async Task<IEnumerable<SkdPersonPhoto>> getPersonsPhotoAsync(IEnumerable<string> userIds )
		{
			var userInfo = await getUserInfoAsync(userIds);//при логине отправл€ю тикет на получение информации пользователей

			return userInfo?.Select(user => new SkdPersonPhoto() {
				UserId = user.UserID,
				PhotoUrl = $"https://m.it.ua/ws/GetFile.ashx?file={user.Photo}&folder=content&nodownload=1"
			});
		}

		/// <summary>
		/// ѕолучение готового списка пользователей
		/// </summary>
		/// <param name="userId"></param>
		/// <returns></returns>
		private async Task<IEnumerable<SkdPerson>> getPersonsAsync(string userId)
		{
			var users = await getUsersAsync();//при логине отправл€ю тикет на получение всех пользователей
			if (users == null)
			{
				return null;
			}
			var user = SessionHandler.Current.GetCurrentUser();
			var allUserList = users.Where(u=>string.IsNullOrEmpty(userId) || string.Equals(u.UserID, userId, StringComparison.InvariantCultureIgnoreCase)).Select(u => new SkdPerson
			{
				UserId = string.IsNullOrEmpty(u.UserID) ? "-" : u.UserID,
				FullName= u.FIO,
				Birthday = u.Birthday,
				Department = u.Departament,
				PlaceName = u.Place,
				SensorName = u.SensorName,
				HasKey = u.HASKEY == "+",
				MovementDate = getDateTime(u.Time),
				MobileTel = u.MobileTel,
				WorkTel= u.Tel,
				Email = u.Email,
				Skype = u.Skype,
		
				IsCurrent = user?.UserId == u.UserID
			});
			
			
			return allUserList;
		}

		private DateTime getDateTime(string argTime)
		{
			var t = new DateTime(1970, 1, 1).AddMilliseconds((long)Convert.ToDouble(argTime.Substring(argTime.IndexOf("(") + 1, argTime.IndexOf(")") - argTime.IndexOf("(") - 1)));
			return DateTime.SpecifyKind(t, DateTimeKind.Local);
			//return t;
		}

		public async Task<IEnumerable<SkdPerson>> GetPersons(string userId)
		{
			return await getPersonsAsync(userId);  	
		}

		public Task<IEnumerable<SkdPersonPhoto>> GetPersonsPhotos(IEnumerable<string> userIds)
		{
			throw new System.NotImplementedException();
		}

		public async Task<SkdPersonPhoto> GetPersonPhoto(string userId)
		{
			var persons = await getPersonsPhotoAsync(new []{userId});
			return persons.FirstOrDefault();

		}

		public async Task<IEnumerable<SkdPersonPhoto>> GetPersonsPhoto(IEnumerable<string> userIds)
		{
			return await getPersonsPhotoAsync(userIds); 
		}

		
	}
}