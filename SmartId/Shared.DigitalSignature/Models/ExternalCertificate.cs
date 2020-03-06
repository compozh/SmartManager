using Shared.DigitalSignature.Core;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Models
{
	/// <summary>
	/// Сертификат пользвателя
	/// </summary>
	/// <exclude />
	public class ExternalCertificate
	{
		/// <summary>
		/// Создать сертификат
		/// </summary>
		/// <param name="certificate"></param>
		public ExternalCertificate(byte[] certificate)
		{
			Certificate = certificate;
		}

		/// <summary>
		/// Пустой сертификат
		/// </summary>
		public bool Empty
		{
			get { return Certificate == null || Certificate.Length == 0; }
		}

		/// <summary>
		/// Сертификат
		/// </summary>
		public byte[] Certificate { get; private set; }

		/// <summary>
		/// Сертификат в виде base64-строки
		/// </summary>
		public string Base64String
		{
			get { return Empty ? string.Empty : Convert.ToBase64String(Certificate); }
		}

		/// <summary>
		/// Хэш сертификата
		/// </summary>
		public string Hash
		{
			get { return Empty ? string.Empty : MD5.GenerateHash(Certificate).ToUpperInvariant(); }
		}
	}
}
