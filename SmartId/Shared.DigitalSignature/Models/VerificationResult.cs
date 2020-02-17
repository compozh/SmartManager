using Shared.DigitalSignature.Enums;
using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Models
{
	public class VerificationResult
	{
		internal VerificationResult(CertificationAuthority ca, string resultString)
		{
			Authority = ca;
			Success = !string.IsNullOrWhiteSpace(resultString);

			var lines = resultString.Split(new[] { "\r\n", "\n", "\r" }, StringSplitOptions.None);
			Success = lines.Length >= 1 && lines[0] == "+";
			SignerInfo = lines.Length >= 2 ? lines[1] : string.Empty;
			SignDateTime = lines.Length >= 3 && !string.IsNullOrWhiteSpace(lines[2]) ? Convert.ToDateTime(lines[2]) : DateTime.MinValue;
			FailReason = lines.Length >= 4 ? lines[3] : string.Empty;
			FailCode = lines.Length >= 5 && !string.IsNullOrWhiteSpace(lines[4]) ? Convert.ToInt32(lines[4]) : 0;

			if (lines.Length >= 6)
			{
				for (int i = 5; i < lines.Length; i++)
				{
					string line = lines[i];

					_keyInfo.Add(line);

				}
			}
		}

		internal static VerificationResult CreateErrorResult(string error, CertificationAuthority ca)
		{
			var ret = new VerificationResult();
			ret.SignerInfo = string.Empty;
			ret.SignDateTime = DateTime.MinValue;
			ret.FailReason = error;
			return ret;
		}

		/// <summary>
		/// Результат неуспешной проверки с сообщением
		/// </summary>
		/// <param name="message"></param>
		/// <returns></returns>
		internal static VerificationResult GetUnsuccessResult(string message)
		{
			return new VerificationResult
			{
				Success = false,
				FailReason = message
			};
		}

		public VerificationResult(CertificationAuthority ca, string resultString, byte[] certificate) : this(ca, resultString)
		{
			Certificate = new ExternalCertificate(certificate);
		}

		private VerificationResult()
		{
		}

		private readonly SignerKeyInfo _keyInfo = new SignerKeyInfo();

		/// <summary>
		/// Результат неуспешной проверки (сбой при проверке)
		/// </summary>
		internal static VerificationResult Empty { get { return new VerificationResult(); } }

		/// <summary>
		/// Цифровая подпись корректна
		/// </summary>
		public bool Success { get; protected set; }

		/// <summary>
		/// <para>Дата и время наложения подписи</para>
		/// </summary>
		/// <exclude />
		public DateTime SignDateTime { get; private set; }

		/// <summary>
		/// Имя подписанта
		/// </summary>
		public string SignerInfo { get; private set; }

		/// <summary>
		/// Получить информацию о ключе подписанта
		/// </summary>
		/// <param name="infoType"></param>
		/// <returns></returns>
		public string GetSignerKeyInfo(string infoType)
		{
			return _keyInfo.GetSignerKeyInfo(infoType);
		}

		/// <summary>
		/// Получить информацию о ключе подписанта
		/// </summary>
		/// <param name="infoType"></param>
		/// <returns></returns>
		public string GetSignerKeyInfo(InfoTypes infoType)
		{
			return GetSignerKeyInfo(infoType.ToString());
		}

		/// <summary>
		/// Получить информацию о ключе подписанта
		/// </summary>
		/// <returns></returns>
		public string GetSignerKeyInfo()
		{
			return _keyInfo.GetSignerKeyInfo();
		}

		/// <summary>
		/// Код причины невалидности подписи
		/// </summary>
		public int FailCode { get; set; }

		/// <summary>
		/// Причина невалидности подписи
		/// </summary>
		public string FailReason { get; protected set; }

		/// <summary>
		/// Центр сертификации
		/// </summary>
		public CertificationAuthority? Authority
		{
			get; private set;
		}

		/// <summary>
		/// Сертификат подписанта
		/// </summary>
		public ExternalCertificate Certificate { get; private set; }
		
		/// <summary>
		/// Код организации, указанный в сертификате подписанта
		/// </summary>
		public string OrganizationId
		{
			get
			{
				if (!Success)
				{
					return string.Empty;
				}
				return GetSignerKeyInfo(InfoTypes.SubjEDRPOUCode);
			}
		}
	}
}
