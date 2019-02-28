using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Web.Authentication
{
	/// <summary>
	/// Результат авторизации
	/// </summary>
	public class LoginResult
	{
		public static LoginResult UnSuccess
		{
			get { return new LoginResult(); }
		}

		public LoginResult()
		{

		}

		public LoginResult(bool sucess, string userLogin, string userName)
		{
			Success = sucess;
			UserLogin = userLogin;
			if (Success && string.IsNullOrEmpty(userName))
			{
				// Признак правильного пароля - непустая строка (ФИО пользователя)
				// Если по каким-либо причинам в TBN2 не указано ФИО пользователя, вернуть любую непустую строку
				userName = "AUTHORIZED_USER";
			}
			UserName = userName;
			Ticket = String.Empty;
		}

		public bool Success { get; set; }
		public string UserLogin { get; set; }
		public string UserId { get; set; }
		public string UserName { get; set; }
		public string Ticket { get; set; }
		public string FailReason { get; set; }
		public bool NeedChangePassword { get; set; }
		public bool TempPasswordRequired { get; set; }
		public string TempPasswordMessage { get; set; }

		private Dictionary<string, object> getBaseInfo()
		{
			return new Dictionary<string, object> {
				{"Success", Success},
				{"Id", UserId},
				{"UserLogin", UserLogin},
				{"UserName", UserName},
				{"Ticket", Ticket},
				{"FailReason", FailReason},
				{"NeedChangePassword", NeedChangePassword},
				{"TempPasswordRequired", TempPasswordRequired},
				{"TempPasswordMessage", TempPasswordMessage}
			};
		}

		internal string ToJson()
		{
			return JsonConvert.SerializeObject(getBaseInfo());
		}

		internal string ToJsonEx()
		{
			var info = getBaseInfo();
			info.Add("UserId", UserId);
			return JsonConvert.SerializeObject(info);
		}
	}
}
