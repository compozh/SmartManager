using Microsoft.AspNetCore.Identity;
using SmartId.Authentication;
using SmartId.Data;
using SmartId.Extensions;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Models
{
	public class SmartIdUser : IdentityUser, IFromSecondStorage, IImportFromTbn, ISetFromSecondStorage
	{
		/// <summary>
		/// Имя
		/// </summary>
		public string Firstname { get; set; }
		/// <summary>
		/// Фамилия
		/// </summary>
		public string Surname { get; set; }
		/// <summary>
		/// Отчество
		/// </summary>
		public string Patronomic { get; set; }

		[NotMapped]
		private bool _isFormSecondStorage;

		[NotMapped]
		public bool IsFormSecondStorage { get { return _isFormSecondStorage; } }

		public bool Import(TbnUserInfo tbnUserInfo)
		{
			if (!Import((BaseTbnUserInfo)tbnUserInfo)) return false;
			Email = tbnUserInfo.Mail;
			NormalizedEmail = tbnUserInfo.Mail.ToUpperInvariant();
			PhoneNumber = tbnUserInfo.Phone;
			Firstname = tbnUserInfo.Firstname;
			Surname = tbnUserInfo.Surname;
			Patronomic = tbnUserInfo.Patronomic;
			return true;
		}

		public bool Import(BaseTbnUserInfo tbnUserInfo)
		{
			if (tbnUserInfo == null) throw new ArgumentNullException(nameof(tbnUserInfo));
			if (tbnUserInfo.UserId == null) return false;
			Id = $"TBN.IMPORT:{tbnUserInfo.UserId}";
			UserName = tbnUserInfo.UserLogin.ToUpperInvariant();
			NormalizedUserName = tbnUserInfo.UserLogin.ToUpperInvariant();
			// или заставить всех подтвердить почту (что плохо), или считать, что уже подтверждена
			EmailConfirmed = true;
			return true;
		}

		void ISetFromSecondStorage.SetFormSecondStorage(bool value)
		{
			_isFormSecondStorage = value;
		}
	}
}
