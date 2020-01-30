using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartId.Extensions;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Web.WebRequests;

namespace SmartId.Authentication
{
	/// <summary>
	/// Внешний логин
	/// </summary>
	public interface IExtrnalSignIn<TUser> : IUserStore<TUser> where TUser : class
	{
		/// <summary>
		/// Проверить валидность логина
		/// </summary>
		/// <param name="userName"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		PasswordVerificationResult SignIn(TUser user, string password);
	}

	/// <summary>
	/// Поддерживает импорт из тбн
	/// </summary>
	public interface IImportFromTbn
	{
		bool Import(TbnUserInfo tbnUserInfo);
		bool Import(BaseTbnUserInfo tbnUserInfo);
	}

	/// <summary>
	/// Настройки хранилища в ТБН
	/// </summary>
	public class TbnUserStorageOptions
	{
		public string WebCalculationUser { get; set; }
	}

	/// <summary>
	/// Хранилище пользователей в tbn
	/// </summary>
	/// <typeparam name="TUser"></typeparam>
	public sealed class TbnUserStore<TUser> : IUserStore<TUser>, IUserEmailStore<TUser>, IExtrnalSignIn<TUser> where TUser : IdentityUser, IImportFromTbn, new()
	{
		private readonly PureWebCalculations _webCalculationsCore;
		private readonly TbnUserStorageOptions _options;
		public TbnUserStore(PureWebCalculations webCalculationsCore, IOptions<TbnUserStorageOptions> options) : base()
		{
			_webCalculationsCore = webCalculationsCore;
			_options = options?.Value ?? new TbnUserStorageOptions { WebCalculationUser = "ITService" };
		}

		public TbnUserStore() : base()
		{
		}

		/// <summary>
		/// Создание (регистрация) нового пользователя
		/// </summary>
		/// <param name="user"></param>
		/// <param name="cancellationToken"></param>
		/// <returns></returns>
		public Task<IdentityResult> CreateAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			//TODO: этап 2, реализовать регистрацию
			throw new NotImplementedException();
		}

		public Task<IdentityResult> UpdateAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			//TODO: этап 2, реализовать редактирование профиля
			throw new NotImplementedException();
		}

		/// <summary>
		/// Удаление пользователя. Не поддерживается.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="cancellationToken"></param>
		/// <returns></returns>
		public Task<IdentityResult> DeleteAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			throw new NotImplementedException();
		}

		/// <summary>
		/// Внешний логин
		/// </summary>
		/// <param name="userName"></param>
		/// <param name="password"></param>
		/// <returns></returns>
		public PasswordVerificationResult SignIn(TUser user, string password)
		{
			if (user == null) throw new ArgumentNullException(nameof(user));

			var loginResult = _webCalculationsCore.LoginEx(user.UserName, password, out var claims);
			if (!loginResult.Success)
			{
				return PasswordVerificationResult.Failed;
			}
			var result = new TUser();
			if (!result.Import(_webCalculationsCore.Exec<BaseTbnUserInfo>(loginResult.Ticket, "SMARTID.GETCURRENTUSER", new { })))
			{
				return PasswordVerificationResult.Failed;
			}
			return PasswordVerificationResult.Success;
		}

		public Task<TUser> FindByNameAsync(string normalizedUserName, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (string.IsNullOrWhiteSpace(normalizedUserName)) throw new ArgumentNullException(nameof(normalizedUserName));
			var tiket = _webCalculationsCore.CreateTicket(_options.WebCalculationUser);
			if (string.IsNullOrWhiteSpace(tiket))
			{
				return Task.FromResult((TUser)null);
			}
			var result = new TUser();
			if (!result.Import(_webCalculationsCore.Exec<BaseTbnUserInfo>(tiket, "SMARTID.FINDUSER", new { Login = normalizedUserName })))
			{
				return Task.FromResult((TUser)null);
			}
			return Task.FromResult(result);
		}

		public Task<TUser> FindByEmailAsync(string normalizedEmail, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (string.IsNullOrWhiteSpace(normalizedEmail)) throw new ArgumentNullException(nameof(normalizedEmail));

			throw new NotImplementedException();
		}

		public Task<TUser> FindByIdAsync(string userId, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (string.IsNullOrWhiteSpace(userId)) throw new ArgumentNullException(nameof(userId));

			throw new NotImplementedException();
		}
		
		/// <summary>
		/// Получить адрес пользователя
		/// </summary>
		/// <param name="user"></param>
		/// <param name="cancellationToken"></param>
		/// <returns></returns>
		public Task<string> GetEmailAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.Email);
		}

		/// <summary>
		/// Получить признак подтверждения. Не поддерживается.
		/// </summary>
		/// <param name="user"></param>
		/// <param name="cancellationToken"></param>
		/// <returns></returns>
		public Task<bool> GetEmailConfirmedAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.EmailConfirmed);
		}

		public Task<string> GetNormalizedEmailAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.NormalizedEmail);
		}

		public Task<string> GetNormalizedUserNameAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.NormalizedUserName);
		}

		public Task<string> GetUserIdAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.Id);
		}

		public Task<string> GetUserNameAsync(TUser user, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			return Task.FromResult(user.UserName);
		}

		public Task SetEmailAsync(TUser user, string email, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			user.Email = email;
			return Task.FromResult<object>(null);
		}

		public Task SetEmailConfirmedAsync(TUser user, bool confirmed, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			user.EmailConfirmed = confirmed;
			return Task.FromResult<object>(null);
		}

		public Task SetNormalizedEmailAsync(TUser user, string normalizedEmail, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			user.NormalizedEmail = normalizedEmail;
			return Task.FromResult<object>(null);
		}

		public Task SetNormalizedUserNameAsync(TUser user, string normalizedName, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			user.NormalizedUserName = normalizedName;
			return Task.FromResult<object>(null);
		}

		public Task SetUserNameAsync(TUser user, string userName, CancellationToken cancellationToken)
		{
			cancellationToken.ThrowIfCancellationRequested();
			if (user == null) throw new ArgumentNullException(nameof(user));

			user.UserName = userName;
			return Task.FromResult<object>(null);
		}

		public void Dispose()
		{
		}
	}
}
