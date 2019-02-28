using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Common;
using System.IdentityModel.Tokens.Jwt;
using System.Threading;
using System.IO;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Web.Authentication;
using Web.Data;
using Web.Tools;
using Web.Tools.Compression;
namespace Web.WebRequests
{
	public class PureWebCalculations
	{
		private readonly SqlClient _sqlClientInstance;
		private readonly IConfiguration _configuration;

		public PureWebCalculations(IConfiguration configuration, SqlClient sqlClientInstance)
		{
			_sqlClientInstance = sqlClientInstance;
			_configuration = configuration.GetSection("AppSettings");
			configuration.Get<ConnectionStringSettingsCollection>();
			
		}

		public string AppName { get; private set; }

		private bool UseCurrentThreadLanguage
		{
			get { return _configuration["USE_CURRENT_LOCALIZATION"] != null; }
		}

		private string CurrentThreadLanguage
		{
			get { return Thread.CurrentThread.CurrentCulture.TwoLetterISOLanguageName.ToUpper(); }
		}

		public const string WrongTicketResult = "WRONG_TICKET";

		/// <summary>
		/// Аутентификация по логину и паролю
		/// </summary>
		/// <param name="login">Имя пользователя для входа в систему</param>
		/// <param name="password">Пароль (в незашифрованном виде)</param>
		/// <returns>ФИО пользователя, если авторизация прошла успешно. Иначе - пустая строка.</returns>
		public string Login(string login, string password)
		{
			var result = processLogin(login, password);
			if (result.Success)
			{
				// Устанавливаем в cookies значение UserLogin
			//	FormsAuthentication.SetAuthCookie(login, false);
			}
			return result.UserName;
		}

		
		/// <summary>
		/// Получить тикет используя Claims
		/// </summary>
		public LoginResult LoginByToken()
		{
			
			var header = HttpContext.Current.Request.Headers["Authorization"];
			var tokenString = header[0].Substring(7);
			var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);
			var claims = token.Claims;
			var claim = claims.FirstOrDefault(c => c.Type == ClaimsIdentity.DefaultNameClaimType);
			var result = new LoginResult(false, string.Empty, string.Empty);

			if (claim == null)
			{
				return result;
			}
			var userLogin = claim.Value;

//			if (string.IsNullOrEmpty(user.UserName))
//			{
//				return result;
//			}

//			var userLogin = user.UserName;
			// Если получити из тикета имя - считаем, что успех

			result.Success = true;
			
			var userInfo = getUserInfo(userLogin);
			// При использовании cookie возможна ситуация, когда пользователь не существует
			if (string.IsNullOrWhiteSpace(userInfo.Id))
			{
				result.Success = false;
			}
			else
			{
				result.UserId = userInfo.Id;
				result.UserName = userInfo.Name;
				result.UserLogin = userLogin;
				result.Ticket = generateTicket(userInfo.Id, false, getPreferredLanguage());
				result.NeedChangePassword = userInfo.NeedChangePass;
				UpdateAccountUsage(userLogin);
			}
		
			return result;
		}


		/// <summary>
		/// Аутентификация по логину и паролю с генерацией временного тикета
		/// </summary>
		/// <param name="login">Имя пользователя для входа в систему</param>
		/// <param name="password">Пароль (в незашифрованном виде)</param>
		/// <param name="claims"></param>
		public LoginResult LoginEx(string login, string password, out IEnumerable<Claim> claims)
		{
			login = login != null ? login.ToUpper() : string.Empty;
			
			var result = processLogin(login, password);
			if (result.Success)
			{
				claims = new List<Claim> {
					new Claim(ClaimsIdentity.DefaultNameClaimType, login),
					new Claim("LoginResult", JsonConvert.SerializeObject(result))
				};
			}
			else
			{
				claims = null;
			}
			return result;
		}

		private const string _defaultLanguageCode = "RU";

		/// <summary>
		/// Получить язык, который предпочитает пользователь, из запроса
		/// </summary>
		/// <returns>2-х символьный код языка</returns>
		private string getPreferredLanguage()
		{
			if (UseCurrentThreadLanguage)
			{
				return CurrentThreadLanguage;
			}
			
			return _defaultLanguageCode;

			
			//TODO: язык
//			var userLanguages = HttpContext.Current.Request.UserLanguages;
//			if (userLanguages == null || userLanguages.Length == 0)
//			{
//				return _defaultLanguageCode;
//			}
//
//			var language = userLanguages[0];
//			var zones = language.Split(';');
//			if (zones.Length > 0)
//			{
//				var preferredLang = zones[0];
//				if (preferredLang.Length >= 2)
//				{
//					return preferredLang.Substring(0, 2).ToUpper();
//				}
//			}
//			return _defaultLanguageCode;
		}


		
		/// <summary>
		/// Обновить статистику использования пароля
		/// </summary>
		/// <param name="userLogin"></param>
		public void UpdateAccountUsage(string userLogin)
		{
			var cmd =  _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITACCOUNTUSAGE";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERLOGIN", userLogin));
			cmd.ExecNonQuery();
		}

		/// <summary>
		/// Создать тикет для пользователя. 
		/// Используется только в приложениях, которые используют веб-расчет напрямую.
		/// </summary>
		/// <param name="login">Логин пользователя</param>
		/// <returns>Тикет, если пользователь с указанным логином существует</returns>
		public string CreateTicket(string login)
		{
			var userInfo = getUserInfo(login);
			if (!string.IsNullOrEmpty(userInfo.Id))
			{
				return generateTicket(userInfo.Id, false, CurrentThreadLanguage);
			}
			return null;
		}

		/// <summary>
		/// Сгенерировать тикет
		/// </summary>
		/// <returns></returns>
		private string generateTicket(string userId, bool tempPassRequired, string language)
		{
			string ticket = Guid.NewGuid().ToString().ToUpperInvariant();
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITWEBCALCCREATICKET";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_ticketid", ticket));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_sessionid", ticket));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userid", userId));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_lang", language));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_temppass", tempPassRequired ? 1 : 0));
			cmd.ExecNonQuery();
			return ticket;
		}


		/// <summary>
		/// Авторизация по логину и паролю
		/// </summary>
		/// <param name="login"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		private LoginResult processLogin(string login, string password)
		{
			var userInfo = getUserInfo(login);
			if (!string.IsNullOrEmpty(userInfo.Id))
			{
				var ldap = tryWithLdap();
				if (ldap)
				{
					// Получить признак импорта учетки из LDAP. В зависимости от признака будет использоваться способ шифрования пароля
					userInfo.Ldap = isLdapUser(userInfo.Id);
				}

				// Строка с указанным UserLogin найдена в TBN2
				// Шифруем пароль и делаем запрос на авторизацию (вызываем WebRequestLoginManager.CheckPassword с помощью планировщика)
				string cryptedPassword = userInfo.CryptUserPass(password);
				var args = new Dictionary<string, string>
				{
					{"USERLOGIN", login},
					{"USERPASSWORD", cryptedPassword},
					{"USERINFO", Tools.GetUserInfo(AppName)}
				};
				var loginCalc = _configuration["LOGINEX"] != "-" ? "LOGINEX" : "LOGIN";
				string resultString = execute(loginCalc, JsonConvert.SerializeObject(args), string.Empty, string.Empty, 0, getPreferredLanguage());
				return processLoginResult(userInfo, resultString);
			}
			return LoginResult.UnSuccess;
		}

		private bool tryWithLdap()
		{
			var prop = _configuration["LDAP"];
			return prop == "+" || Text.CompareEx(prop, "true");
		}

		/// <summary>
		/// Обработать ответ сервера по входу в систему
		/// </summary>
		/// <param name="userInfo"></param>
		/// <param name="loginResult"></param>
		/// <returns></returns>
		private LoginResult processLoginResult(UserInfo userInfo, string loginResult)
		{
			bool success;
			string failReason = null;
			bool tempPass = false;
			string tempPassMessage = null;
			string ticket = null;
			//TODO: временное решение для сохранения обратной совместимости
			//TODO: в версии 2016 сделать обработку только словаря
			// Возможен bool и Dictionary<string, object>
			// Сначала пробуем bool
			if (!bool.TryParse(loginResult, out success))
			{
				try
				{
					var dictResult = JsonConvert.DeserializeObject<Dictionary<string, object>>(loginResult);
					success = (bool) dictResult["SUCCESS"];
					failReason = (string) dictResult["FAILREASON"];
					tempPassMessage = (string) dictResult["TEMPPASSWORDMESSAGE"];
					tempPass = (bool) dictResult["TEMPPASSWORDREQUIRED"];
					ticket = (string) dictResult["TICKET"];
				}
				catch
				{
				}
			}
			var result = new LoginResult
			{
				Success = success
			};
			// Возвращаем идентификатор и имя только в случае успешного входа
			if (success)
			{
				result.UserId = userInfo.Id;
				result.UserName = userInfo.Name;
				result.NeedChangePassword = userInfo.NeedChangePass;
				result.TempPasswordRequired = tempPass;
				result.TempPasswordMessage = tempPassMessage;
				result.Ticket = ticket;
			}
			else
			{
				result.FailReason = failReason;
			}
			return result;
		}

		/// <summary>
		/// Аутентификация по токену google
		/// </summary>
		/// <param name="token"></param>
		/// <returns></returns>
		/// <remarks>
		/// <para>Поддерживатся get-параметры:</para>
		/// <para>db - ИД соединения вместо стандартного</para>
		/// <para>pureJSON - возвражать результат в виде чистого JSON без XML-обертки</para>
		/// </remarks>
		public LoginResult LoginByGoogleId(string token)
		{
			// Запросить у google информацию о токене
			const string googleAuthUrl = "https://www.googleapis.com/oauth2/v1/userinfo?access_token={0}";
			string result = Tools.HttpGetRequest(string.Format(googleAuthUrl, token));

			// Ответ в формате JSON конвертировать в Dictionary
			var values = JsonConvert.DeserializeObject<Dictionary<string, object>>(result);
			// Взять из Dictionary email, соответсвующий токену
			object email;
			if (!values.TryGetValue("email", out email))
			{
				return LoginResult.UnSuccess;
			}

			// В БД проверить логин, соответсвующий email'у
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITLOGINGOOGLE";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_googleid", email));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userid", string.Empty));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userfio", string.Empty));
			var useridParameter = cmd.Parameters["p_userid"];
			useridParameter.Direction = ParameterDirection.Output;
			useridParameter.Size = 10;
			var userNameParameter = cmd.Parameters["p_userfio"];
			userNameParameter.Direction = ParameterDirection.Output;
			userNameParameter.Size = 50;
			cmd.ExecNonQuery();
			string userId = useridParameter.Value.ToString();
			string userName = userNameParameter.Value.ToString();
			LoginResult loginResult;
			if (string.IsNullOrWhiteSpace(userId))
			{
				loginResult = LoginResult.UnSuccess;
			}
			else
			{
				loginResult = new LoginResult(true, string.Empty, userName) { UserId = userId, Ticket = generateTicket(userId, false, getPreferredLanguage()) };
			}

			return loginResult;
		}

		/// <summary>
		/// Выполнить расчет
		/// </summary>
		/// <param name="calcId"></param>
		/// <param name="args"></param>
		/// <param name="timeout"></param>
		/// <returns></returns>
		public string Execute(string calcId, string args, int timeout = 0)
		{
			return execute(calcId, args, string.Empty, string.Empty, timeout);
		}

		/// <summary>
		/// Выполнить расчет, авторизация по тикету
		/// </summary>
		/// <param name="calcId">Код расчета</param>
		/// <param name="args">Параметры расчета в формате JSON</param>
		/// <param name="ticket">
		///     <para>Временный билет, сгенерированный web-методами <see cref="LoginEx"/> либо <see cref="LoginByGoogleId"/></para>
		///     <para>Без билета можно вызывать расчеты, для которых разрешен анонимный доступ</para>
		/// </param>
		/// <param name="timeout">Тайм-аут выполнения
		/// </param>
		/// <returns>
		/// <para>Результат расчета</para>
		/// <para>При ошибках в процессе расчета возвращается возникшая ошибка</para>
		/// <para>Если <paramref name="ticket"/> устарел, то возвращается константа "WRONG_TICKET"</para>
		/// </returns>
		/// <remarks>
		/// <para>Поддерживатся get-параметры:</para>
		/// <para>db - ИД соединения вместо стандартного</para>
		/// <para>pureJSON - возвражать результат в виде чистого JSON без XML-обертки</para>
		/// </remarks>
		public string ExecuteEx(string calcId, string args, string ticket, int timeout = 0)
		{
			return executeEx(calcId, args, ticket, false, timeout);
		}

		public async Task<string> ExecuteExAsync(string calcId, string args, string ticket, int timeout = 0)
		{
			return await executeExAsync(calcId, args, ticket, false, timeout).ConfigureAwait(false);
		}

		/// <summary>
		/// Получить userid по тикету
		/// </summary>
		/// <param name="ticket">тикет</param>
		/// <returns></returns>
		public string GetUserIdByTicket(string ticket)
		{
			string userLogin;
			return GetUserIdByTicket(ticket, out userLogin);
		}

		/// <summary>
		/// получить userid по тикету
		/// </summary>
		/// <param name="ticket"></param>
		/// <param name="userLogin"></param>
		/// <returns></returns>
		public string GetUserIdByTicket(string ticket, out string userLogin)
		{
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITWEBCALCGETTICKET";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_ticketId", ticket));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userId", ""));
			var responeParameter = cmd.Parameters["p_userId"];
			responeParameter.Direction = ParameterDirection.Output;
			responeParameter.Size = 10;
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userlogin", ""));
			var userLoginParameter = cmd.Parameters["p_userlogin"];
			userLoginParameter.Direction = ParameterDirection.Output;
			userLoginParameter.Size = 254;
			cmd.ExecNonQuery();
			userLogin = _sqlClientInstance.IsNull(userLoginParameter)
				? string.Empty
				: userLoginParameter.Value.ToString().Trim();
			return _sqlClientInstance.IsNull(responeParameter) ?
				string.Empty :
				responeParameter.Value.ToString().Trim();
		}

		private bool? _isDebugMode;

		private bool isDebugMode()
		{
			if (_isDebugMode == null)
			{
				_isDebugMode = _configuration["DEBUGMODE"] == "true";
			}
			return _isDebugMode.Value;
		}

		/// <summary>
		/// Выполнить расчет
		/// </summary>
		private string execute(string calcId, string args, string userId, string ticket, int timeout = 0, string lang = null)
		{
			if (isDebugMode())
			{
				args = string.Format("{0}#{1}#", args, Environment.UserName.ToLower());
			}
			if (lang == null && UseCurrentThreadLanguage)
			{
				lang = CurrentThreadLanguage;
			}

			DbParameter responseParameter;
			var cmd = createCalcCommand(calcId, args, timeout, userId, ticket, lang, Tools.GetUserIP(true), out responseParameter);
			object result = _sqlClientInstance.CallProcedureWithBigResult(cmd, responseParameter);
			return processCalcResult(result);
		}

		private async Task<string> executeAsync(string calcId, string args, string userId, string ticket,int timeout = 0, string lang = null)
		{
			if (isDebugMode())
			{
				args = string.Format("{0}#{1}#", args, Environment.UserName.ToLower());
			}
			DbParameter responseParameter;
			if (lang == null && UseCurrentThreadLanguage)
			{
				lang = CurrentThreadLanguage;
			}
			var cmd = createCalcCommand(calcId, args, timeout, userId, ticket, lang, Tools.GetUserIP(true), out responseParameter);
			object result = await _sqlClientInstance.CallProcedureWithBigResultAsync(cmd, responseParameter).ConfigureAwait(false);
			return processCalcResult(result);
		}

		private SqlCmd createCalcCommand(string calcId, string args, int timeout, string userId, string ticket, string lang, string userIp, out DbParameter responseParameter)
		{
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITEXECWEBCALC";
			cmd.Timeout = 0;
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_calcId", calcId.ToUpper()));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_args", args));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_timeout", timeout * 1000));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_userid", userId));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_ticket", string.IsNullOrWhiteSpace(ticket) ? null : ticket));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_lang", lang));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_server", Environment.MachineName));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_ip", userIp));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_respone", DBNull.Value));
			responseParameter = cmd.Parameters["p_respone"];
			responseParameter.Direction = ParameterDirection.Output;
			responseParameter.DbType = _sqlClientInstance.Type == SqlClient.DbType.Oracle ? DbType.String : DbType.Binary;
			responseParameter.Size = Int32.MaxValue;
			return cmd;
		}

		private string processCalcResult(object result)
		{
			// Разархивировать результат
			byte[] bytes;
			if (result is string)
			{
				bytes = Text.Win1251Encoding.GetBytes((string)result);
			}
			else
			{
				bytes = result as byte[];
			}

			if (bytes == null || bytes.Length == 0)
			{
				return string.Empty;
			}
			using (MemoryStream
				inputStream = new MemoryStream(bytes),
				decompressedStream = new MemoryStream())
			{
				GZip.Decompress(inputStream, decompressedStream);
				return Encoding.UTF8.GetString(decompressedStream.ToArray());
			}
		}

		/// <summary>
		/// Выполнить расчет, авторизация по тикету
		/// </summary>
		private string executeEx(string calcId, string args, string ticket, bool isInternal, int timeout = 0)
		{
			string result;
			if (string.IsNullOrEmpty(ticket))
			{
				// если не задан ticket, то выполнять обычный execute
				result = Execute(calcId, args, timeout);
			}
			else
			{
				
				string userId = GetUserIdByTicket(ticket);
				if (string.IsNullOrWhiteSpace(userId))
				{
					// Неверный тикет. Необходима повторная авторизация
					result = WrongTicketResult;
				}
				else
				{
					result = execute(calcId, args, userId, ticket, timeout);
				}
			}
			return isInternal ? result : processWebServiceReturnValue(result);
		}

		private async Task<string> executeExAsync(string calcId, string args, string ticket, bool isInternal, int timeout = 0)
		{
			string result;
			if (string.IsNullOrEmpty(ticket))
			{
				// если не задан ticket, то выполнять обычный execute
				result = await executeAsync(calcId, args, string.Empty, string.Empty).ConfigureAwait(false);
			}
			else
			{
				
				string userId = GetUserIdByTicket(ticket);
				if (string.IsNullOrWhiteSpace(userId))
				{
					// Неверный тикет. Необходима повторная авторизация
					result = WrongTicketResult;
				}
				else
				{
					result = await executeAsync(calcId, args, userId, ticket, timeout).ConfigureAwait(false);
				}
			}

			return isInternal ? result : processWebServiceReturnValue(result);
		}

		/// <summary>
		/// Обработать значение, возвращаемое web-сервисом.
		/// Передать вызывающей стороне xml+json либо чистый json, в зависимости от get-параметров
		/// </summary>
		/// <param name="returnValue"></param>
		/// <returns></returns>
		private string processWebServiceReturnValue(string returnValue)
		{
			return returnValue;
		}

		private bool isLdapUser(string userId)
		{
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandText = string.Format("select {0}(@P_USERID) {1}", _sqlClientInstance.GetFunctionFullName("ITLOGINLDAP"), _sqlClientInstance.Api.EmptyFrom());
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERID", userId));
			DbParameter userIdParameter = cmd.Parameters["P_USERID"];
			userIdParameter.Size = 10;
			return cmd.ExecScalar<string>() == "+";
		}

		private UserInfo getUserInfo(string login)
		{
			login = login != null ? login.ToUpper() : string.Empty;
			// Получение UserId и соли для шифрования пароля по UserLogin
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITLOGIN_GETUSERINFO";
			//cmd.CommandText = "LOGIN_GETUSERINFO_";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERLOGIN", login));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERID", string.Empty));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERFIO", string.Empty));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_USERSAPS", string.Empty));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_CHANGEPASS", 0));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_SMUSER", string.Empty));
			//cmd.Parameters.Add(_sqlClientInstance.CreateParameter("P_LDAP", string.Empty));

			DbParameter userIdParameter = cmd.Parameters["P_USERID"];
			userIdParameter.Direction = ParameterDirection.Output;
			userIdParameter.Size = 10;
			DbParameter userNameParameter = cmd.Parameters["P_USERFIO"];
			userNameParameter.Direction = ParameterDirection.Output;
			userNameParameter.Size = 50;
			DbParameter userSapsParameter = cmd.Parameters["P_USERSAPS"];
			userSapsParameter.Direction = ParameterDirection.Output;
			userSapsParameter.Size = 10;
			DbParameter smUserParameter = cmd.Parameters["P_SMUSER"];
			smUserParameter.Direction = ParameterDirection.Output;
			smUserParameter.Size = 10;
			DbParameter needChangePassParameter = cmd.Parameters["P_CHANGEPASS"];
			needChangePassParameter.Direction = ParameterDirection.Output;
			//DbParameter ldapParameter = cmd.Parameters["P_LDAP"];
			//ldapParameter.Direction = ParameterDirection.Output;
			//ldapParameter.Size = 1;
			cmd.ExecNonQuery();
			return new UserInfo {
				Id = Text.Convert(userIdParameter.Value).TrimEnd(),
				Name = Text.Convert(userNameParameter.Value).TrimEnd(),
				Saps = Text.Convert(userSapsParameter.Value).TrimEnd(),
				NeedChangePass = Convert.ToInt32(needChangePassParameter.Value) == 1,
				Login = login,
				SmUser = Text.Convert(smUserParameter.Value).TrimEnd(),
				//Ldap = Text.Convert(ldapParameter.Value).TrimEnd() == "+"
			};
		}

		/// <summary>
		/// Обновить идентификатор мобильной сессии
		/// </summary>
		/// <param name="ticket">Текущий тикет</param>
		/// <param name="sessionId">Идентификатор сессии для тикета</param>
		public void UpdateSessionId(string ticket, string sessionId)
		{
			
			var cmd = _sqlClientInstance.CreateCommand();
			cmd.CommandType = CommandType.StoredProcedure;
			cmd.CommandText = "ITWEBCALCUPDSESSION";
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_ticketid", ticket));
			cmd.Parameters.Add(_sqlClientInstance.CreateParameter("p_sessionid", sessionId));
			cmd.ExecNonQuery();
		}

		/// <summary>
		/// Информация о пользователе
		/// </summary>
		private class UserInfo
		{
			public string Id { get; set; }
			public string Name { get; set; }
			public string Saps { get; set; }
			public bool NeedChangePass { get; set; }
			public string Login { get; set; }
			public string SmUser { get; set; }
			public bool Ldap { get; set; }

			public string CryptUserPass(string password)
			{
				if (!Ldap)
				{
					return Crypt.LoginManager.CryptUserPass(password, Saps, string.IsNullOrWhiteSpace(SmUser) ? Id : SmUser);
				}

				return Crypt.Encrypt(password, Saps);
			}
		}
	}
}