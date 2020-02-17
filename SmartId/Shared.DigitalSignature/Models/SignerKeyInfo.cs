using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Models
{
	/// <summary>
	/// Информация о ключе
	/// </summary>
	public class SignerKeyInfo
	{
		/// <summary>
		/// Дополнительная информация о сертификате подписанта
		/// </summary>
		private readonly Dictionary<string, string> _signerKeyInfo = new Dictionary<string, string>(StringComparer.OrdinalIgnoreCase);

		internal SignerKeyInfo()
		{
			Success = true;
		}

		internal SignerKeyInfo(bool success, string message)
		{
			Success = success;
			ErrorMessage = message;
		}

		/// <summary>
		/// Признак успешного получения информации
		/// </summary>
		public bool Success { get; private set; }

		/// <summary>
		/// Сообщение в случае неуспешного считывания ключа
		/// </summary>
		public string ErrorMessage { get; private set; }

		internal void Add(string line)
		{
			int indexOf = line.IndexOf('=');
			if (indexOf <= 0)
			{
				return;
			}
			string key = line.Substring(0, indexOf).Trim();
			string value = line.Substring(indexOf + 1).Trim();
			if (!_signerKeyInfo.ContainsKey(key))
			{
				// Протокол многострочный. На клиенте кодируем в base64
				if (key == "protocol" || key == "verifyProtocol")
				{
					value = Encoding.UTF8.GetString(Convert.FromBase64String(value));
				}
				_signerKeyInfo.Add(key, value);
			}
		}

		/// <summary>
		/// Получить информацию о ключе подписанта
		/// </summary>
		public string GetSignerKeyInfo()
		{
			var infos = new List<string>();
			foreach (var keyValuePair in _signerKeyInfo)
			{
				string key = keyValuePair.Key;
				string value = keyValuePair.Value;
				if (string.IsNullOrWhiteSpace(value))
				{
					continue;
				}
				string name = key;
				/*InfoTypes enumKey;
				if (Enum.TryParse(key, true, out enumKey))
				{
					var mapValue = EnumAttributes.GetEnumAttribute(enumKey);
					if (mapValue != null)
					{
						string enumCaption = mapValue.GetCaption();
						if (!string.IsNullOrWhiteSpace(enumCaption))
						{
							name = enumCaption;
						}
					}
				}*/
				infos.Add(string.Format("{0} = {1}", name, value));
			}
			return string.Join("\r\n", infos);
		}

		/// <summary>
		/// Получить информацию о ключе подписанта
		/// </summary>
		public string GetSignerKeyInfo(string infoType)
		{
			string value;
			return _signerKeyInfo.TryGetValue(infoType, out value) ? value : string.Empty;
		}
	}
}
