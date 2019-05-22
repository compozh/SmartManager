using System;
using System.Data.SqlClient;
using System.Threading.Tasks;
using ItGraphQlSchema.Types.ITLogic.Model;
using Newtonsoft.Json;
using Web.Data;
using Web.WebRequests;

namespace ItGraphQlSchema.Types.ITLogic
{
	[AddInDIAttribute]
	public class ITPortalProvider
	{
		private readonly WebRequestsTools _webRequest;
		private readonly SqlClient _client;
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
			var selectString = @"declare @sqlParameter varchar(200) = @arg
								select K.EMAIL, K.FAM2, K.NAM2, K.OTCH2, K.D_ROZD, D.MDOR from ittbn2 I
								JOIN TBNKDK T ON T.USERID = I.USERID 
								JOIN KDK K ON K.n_kdk = T.n_kdk
								LEFT JOIN DOR D ON D.ALIAS = 'KDK' AND D.KDOR = K.N_KDK
								where userlogin = @sqlParameter";
			
			return commonSendToSQL(selectString, userLogin);;
		}
		
		/// <summary>
		/// Обращение к базе данных,
		/// </summary>
		/// <param name="select"> Что собираемся извлекать</param>
		/// <param name="arg"> SqlParameter</param>
		/// <param name="condition"> Условие для возращения результата</param>
		/// <returns></returns>
		private UserAccount commonSendToSQL(string select, string sqlParameter)
		{
			UserAccount result = null;

			var command = _client.CreateCommand(select);
			command.Parameters.Add(new SqlParameter("@arg", sqlParameter));
			command.Connection.Open();
			
				using (var reader = command.ExecuteReader())
				{
					if (reader.HasRows)
					{
						while (reader.Read())
					{
						var len = reader.IsDBNull(5) ? 0 : reader.GetBytes(5, 0, null, 0, 0);
						var photo = string.Empty;
						if (!len.Equals(0))
						{
							var buffer = new Byte[len];
							reader.GetBytes(5, 0, buffer, 0, (int) len) ;
							photo = Convert.ToBase64String(buffer);
						}
						
						result = new UserAccount()
						{
							Email = reader.GetString(0).Trim(),
							LastName = reader.GetString(1).Trim(),
							FirstName = reader.GetString(2).Trim(),
							Patronymic = reader.GetString(3).Trim(),
							DateBirthday = reader.GetDateTime(4).ToShortDateString(),
							Photo = photo
						};
					}
				}
			}

			return result;
		}
	}
}
