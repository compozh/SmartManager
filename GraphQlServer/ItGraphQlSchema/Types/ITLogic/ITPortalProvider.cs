using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ItGraphQlSchema.Types.ITLogic.Model;
using Newtonsoft.Json;
using Web.Data;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AtributeAddInDI]
	public class ITPortalProvider
	{
		private readonly WebRequestsTools _webRequest;
		private readonly SqlClient _client;
		private UserAccount _user;
		public ITPortalProvider(SqlClient client, WebRequestsTools webRequest)
		{
			_webRequest = webRequest;
			_client = client;
		}
		/// <summary>
		/// Получение меню, и раздела первого по списку меню
		/// </summary>
		/// <returns></returns>
		public async Task<ITMenu> GetMenu()
		{
			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENU", string.Empty);
			return JsonConvert.DeserializeObject<ITMenu>(responseFromWeb.Content);
		}

		/// <summary>
		/// Получение всех разделов по выбранному пункту меню
		/// </summary>
		/// <param name="moduleCode"> Код модуля</param>
		/// <returns></returns>
		public async Task<MenuModule> GetModuleContent(string moduleCode)
		{
			var args = $"{{\"MODULECODE\":\"{moduleCode}\"}}";

			var responseFromWeb = await _webRequest.CallWebRequestAsync("ITPORTAL.MENUMODULE", args);
			return JsonConvert.DeserializeObject<MenuModule>(responseFromWeb.Content);
		}
		
		/// <summary>
		/// Получение информации о пользователе
		/// </summary>
		/// <param name="userLogin"> Логин пользователя</param>
		/// <returns></returns>
		public async Task<UserAccount> GetUserAccount(string userLogin)
		{
			_user = new UserAccount();
			var userId = string.Empty;
			var userKdk = string.Empty;
			var condition = "SIMPLE";

			var selectString = @"select userid from ittbn2 where userlogin = @sqlParameter";
			userId = commonSendToSQL(selectString, userLogin, condition).ToString();
			
			selectString = @"select N_KDK from TBNKDK where USERID = @sqlParameter";
			userKdk = commonSendToSQL(selectString, userId, condition).ToString();

			condition = "USER";
			selectString = @"select EMAIL, FAM2, NAM2, OTCH2, D_ROZD from kdk where n_kdk = @sqlParameter";
			_user = commonSendToSQL(selectString, userKdk, condition) as UserAccount;

			condition = "PHOTO";
			selectString = @"select MDOR from DOR where alias = 'KDK' and DOR.KDOR  = @sqlParameter";
			_user.LinkToPhoto = commonSendToSQL(selectString, userKdk, condition).ToString();
			
			return _user;
		}
		
		/// <summary>
		/// Обращение к базе данных,
		/// </summary>
		/// <param name="select"> Что собираемся извлекать</param>
		/// <param name="arg"> SqlParameter</param>
		/// <param name="condition"> Условие для возращения результата</param>
		/// <returns></returns>
		private object commonSendToSQL(string select, string sqlParameter, string condition)
		{
			var zero = 0;
			var one = 1;
			var two = 2;
			var trhee = 3;
			var four = 4;
			
			object result = null;
			var command = _client.CreateCommand(select);
			command.Parameters.Add(new SqlParameter("@sqlParameter", sqlParameter));
			command.Connection.Open();
			using (var reader = command.ExecuteReader())
			{
				if (reader.HasRows)
				{
					while (reader.Read())
					{
						if(condition.Equals("SIMPLE")){
							result = reader.GetString(zero);
						}else if (condition.Equals("USER"))
						{
							result = new UserAccount()
							{
								Email = reader.GetString(zero).Trim(),
								FullName = reader.GetString(one).Trim() + " " + reader.GetString(two).Trim() + " " + reader.GetString(trhee).Trim(),
								DateBirthday = reader.GetDateTime(four).ToShortDateString()
							};
						}else if (condition.Equals("PHOTO"))
						{
							result = Convert.ToBase64String(reader.GetValue(zero) as byte[]);
						}
					}
				}
			}

			return result;
		}
	}
}
