using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Models
{
	/// <summary>
	/// Базовый класс с описанием пользователя
	/// </summary>
	public class BaseTbnUserInfo
	{
		/// <summary>
		/// Код пользователя
		/// </summary>
		public string UserId { get; set; }
		/// <summary>
		/// Логин пользователя
		/// </summary>
		public string UserLogin { get; set; }
	}

	/// <summary>
	/// Профиль пользователя
	/// </summary>
	public class TbnUserInfo : BaseTbnUserInfo
	{
		/// <summary>
		/// Почта
		/// </summary>
		public string Mail { get; set; }
		/// <summary>
		/// Телефон
		/// </summary>
		public string Phone { get; set; }
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
	}
}
