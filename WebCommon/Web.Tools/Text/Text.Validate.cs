using System;
using System.ComponentModel;
using System.Net.Mail;

namespace Web.Tools
{
	partial class Text
	{
		/// <summary>
		/// Проверить корректность Email-адреса
		/// </summary>
		/// <param name="email">Email-адрес</param>
		/// <returns>Корректный адрес или нет</returns>
		public static bool IsValidEmail(string email)
		{
			if (string.IsNullOrEmpty(email))
			{
				return false;
			}
			if (email.Trim().Contains(" "))
			{
				return false;
			}
			try
			{
				var mailAddress = new MailAddress(email);
				if (!string.IsNullOrEmpty(mailAddress.DisplayName) || CheckNationalSymbols(mailAddress.User))
				{
					return false;
				}
				if (Uri.CheckHostName(mailAddress.Host) == UriHostNameType.Unknown || mailAddress.Host.EndsWith("."))
				{
					return false;
				}
				return true;
			}
			catch (Exception)
			{
				return false;
			}
		}

		/// <summary>
		/// Проверить является ли символ символом латинского алфавита
		/// </summary>
		/// <param name="c">Символ, для которого будет выполнена проверка</param>
		/// <returns>Результат проверки</returns>
		/// <exclude />
		[EditorBrowsable(EditorBrowsableState.Never)]
		[Browsable(false)]
		public static bool IsLatinLetter(char c)
		{
			return (c >= 65 && c <= 90) || (c >= 97 && c <= 122);
		}

		/// <summary>
		/// Проверить наличие наличие национальных символов в идентификаторе
		/// </summary>
		/// <param name="value">Строковый идентификатор для которого будет выполнена проверка</param>
		/// <returns>Результат проверки</returns>
		/// <exclude />
		[EditorBrowsable(EditorBrowsableState.Never)]
		[Browsable(false)]
		public static bool CheckNationalSymbols(string value)
		{
			if (!string.IsNullOrWhiteSpace(value))
			{
				foreach (var c in value)
				{
					if (char.IsLetter(c) && !IsLatinLetter(c))
					{
						return true;
					}
				}
			}
			return false;
		}
	}
}
