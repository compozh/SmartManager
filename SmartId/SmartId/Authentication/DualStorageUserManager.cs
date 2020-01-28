using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using SmartId.Data;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;

namespace SmartId.Authentication
{
	/// <summary>
	/// Интерфейс признака, что данные извлечены из второго хранилища
	/// </summary>
	public interface IFromSecondStorage
	{
		/// <summary>
		/// Запись извлечена из второго хранилища
		/// </summary>
		bool IsFormSecondStorage { get; }
	}
	/// <summary>
	/// Интерфейс признака, что данные извлечены из второго хранилища
	/// </summary>
	public interface ISetFromSecondStorage
	{
		/// <summary>
		/// Запись извлечена из второго хранилища
		/// </summary>
		void SetFormSecondStorage(bool value);
	}

	public class DualStorageUserManager<TUser> : UserManager<TUser> where TUser : IdentityUser, IFromSecondStorage, ISetFromSecondStorage
	{
		private readonly IExtrnalSignIn<TUser> _secondStore;
		public DualStorageUserManager(IUserStore<TUser> store, IOptions<IdentityOptions> optionsAccessor, IPasswordHasher<TUser> passwordHasher, IEnumerable<IUserValidator<TUser>> userValidators,
			IEnumerable<IPasswordValidator<TUser>> passwordValidators, ILookupNormalizer keyNormalizer, IdentityErrorDescriber errors, IServiceProvider services, ILogger<UserManager<TUser>> logger, 
			IExtrnalSignIn<TUser> secondStore)
			: base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
		{
			_secondStore = secondStore;
		}

		public override async Task<TUser> FindByNameAsync(string userName)
		{
			// если не нашли в первой, то поискать во второй и выставить признак
			var result = await base.FindByNameAsync(userName).ConfigureAwait(false);
			if (result != null)
			{
				return result;
			}
			return await _secondStore.FindByNameAsync(userName, CancellationToken).ConfigureAwait(false);
		}

		protected override async Task<PasswordVerificationResult> VerifyPasswordAsync(IUserPasswordStore<TUser> store, TUser user, string password)
		{
			if (user == null) throw new ArgumentNullException(nameof(user));
			var result = await base.VerifyPasswordAsync(store, user, password).ConfigureAwait(false);
			if (result != PasswordVerificationResult.Failed)
			{
				return result;
			}
			result = _secondStore.SignIn(user, password);
			if (result != PasswordVerificationResult.Failed)
			{
				user.SetFormSecondStorage(true);
				await updatePasswordWithoutValidation(user, password).ConfigureAwait(false);
				var createResult = await base.CreateAsync(user).ConfigureAwait(false);
				if (createResult.Succeeded)
				{
					//base.AddClaimsAsync(TUser, Claim);
				}
			}
			return result;
		}

		private async Task<IdentityResult> updatePasswordWithoutValidation(TUser user, string newPassword)
		{
			var passwordStore = getPasswordStore();
			await passwordStore.SetPasswordHashAsync(user, PasswordHasher.HashPassword(user, newPassword), CancellationToken).ConfigureAwait(false);
			await updateSecurityStampInternal(user).ConfigureAwait(false);
			return IdentityResult.Success;
		}

		private IUserPasswordStore<TUser> getPasswordStore()
		{
			var cast = Store as IUserPasswordStore<TUser>;
			if (cast == null)
			{
				throw new NotSupportedException();
			}
			return cast;
		}

		private IUserSecurityStampStore<TUser> getSecurityStore()
		{
			var cast = Store as IUserSecurityStampStore<TUser>;
			if (cast == null)
			{
				throw new NotSupportedException();
			}
			return cast;
		}

		private async Task updateSecurityStampInternal(TUser user)
		{
			if (SupportsUserSecurityStamp)
			{
				await getSecurityStore().SetSecurityStampAsync(user, newSecurityStamp(), CancellationToken).ConfigureAwait(false);
			}
		}

		private static string newSecurityStamp()
		{
			return Guid.NewGuid().ToString();
		}
	}
}
