using EUSignCP;
using MobileIdProxy.Helpers;
using Shared.DigitalSignature.Enums;
using Shared.DigitalSignature.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Shared.DigitalSignature
{
	/// <summary>
	/// Методы для работы с ЭЦП
	/// </summary>
	public class DigitalSignature
	{
		/// <summary>
		/// Верификация подписи на сервере приложений
		/// </summary>
		/// <param name="file"></param>
		/// <param name="signFile"></param>
		/// <param name="offline">Выполнять проверку в offline-режиме без проверки статуса сертификата, даже если АЦСК поддерживает OCSP</param>
		/// <returns></returns>
		public VerificationResult VerifyFileSignature(string file, string signFile, bool offline = false)
		{
			int errorCode;
			
			IEUSignCP.EU_SIGN_INFO signInfo;
			byte[] certificate;
			int retCode;
			string acskName = getAcksName(signFile, false, out certificate);
			if (string.IsNullOrWhiteSpace(acskName))
			{
				return VerificationResult.GetUnsuccessResult("Подпись в неверном формате");
			}

			var acsk = findCaByName(acskName);
			if (acsk == null)
			{
				return VerificationResult.GetUnsuccessResult(string.Format("Неподдерживаемый АЦСК: {0}", acskName));
			}

			if (!offline && !string.IsNullOrWhiteSpace(acsk.ocspAccessPointAddress))
			{
				// Проверить, используя OCSP
				retCode = IEUSignCP.VerifyFile(signFile, file, out signInfo);
			}
			else
			{
				// Проверить в режиме offline
				retCode = IEUSignCP.VerifyFileOnTimeEx(0, signFile, file, null, true, true, out signInfo);
			}
			string resultString = GetVerificationResult(retCode, signInfo, true);
			return new VerificationResult(CertificationAuthority.Iit, resultString, certificate);
		}

		/// <summary>
		/// Верификация подписи на сервере приложений
		/// </summary>
		/// <param name="data"></param>
		/// <param name="sign"></param>
		/// <param name="offline">Выполнять проверку в offline-режиме без проверки статуса сертификата, даже если АЦСК поддерживает OCSP</param>
		/// <returns></returns>
		public VerificationResult VerifyDataSignature(string data, string sign, bool offline = false)
		{
			int errorCode;

			IEUSignCP.EU_SIGN_INFO signInfo;
			byte[] certificate;
			int retCode;
			string acskName = getAcksName(sign, true, out certificate);
			if (string.IsNullOrWhiteSpace(acskName))
			{
				return VerificationResult.GetUnsuccessResult("Подпись в неверном формате");
			}

			var acsk = findCaByName(acskName);
			if (acsk == null)
			{
				return VerificationResult.GetUnsuccessResult(string.Format("Неподдерживаемый АЦСК: {0}", acskName));
			}

			if (!offline && !string.IsNullOrWhiteSpace(acsk.ocspAccessPointAddress))
			{
				// Проверить, используя OCSP
				retCode = IEUSignCP.VerifyData(data, sign, out signInfo);
			}
			else
			{
				// Проверить в режиме offline
				retCode = IEUSignCP.VerifyDataOnTimeEx(data, 0, sign, null, true, true, out signInfo);
			}
			string resultString = GetVerificationResult(retCode, signInfo, true);
			return new VerificationResult(CertificationAuthority.Iit, resultString, certificate);
		}

		/// <summary>
		/// Получить строку с результатом верификации
		/// </summary>
		/// <param name="errorCode"></param>
		/// <param name="signInfo"></param>
		/// <param name="serverFormat"></param>
		/// <returns></returns>
		internal static string GetVerificationResult(int errorCode, IEUSignCP.EU_SIGN_INFO signInfo, bool serverFormat = false)
		{
			bool success = errorCode == 0;
			// Для электронной печати subjFullName пустой, поэтому выводим subjCN
			string userName = success ? (String.IsNullOrWhiteSpace(signInfo.subjFullName) ? signInfo.subjCN : signInfo.subjFullName) : String.Empty;

			string signDate = String.Empty;
			if (success && signInfo.time.wYear != 0)
			{
				signDate = new DateTime(
					signInfo.time.wYear,
					signInfo.time.wMonth,
					signInfo.time.wDay,
					signInfo.time.wHour,
					signInfo.time.wMinute,
					signInfo.time.wSecond).ToString("dd.MM.yyyy HH:mm:ss");
			}

			string failReason = success ? String.Empty : getErrorDescription(errorCode);

			var result = new List<string>();

			result.Add(success ? "+" : "-");
			result.Add(userName);
			result.Add(signDate);
			result.Add(failReason);
			result.Add(errorCode.ToString());
			if (success)
			{
				addSignInfo(result, "issuer", signInfo.issuer);
				addSignInfo(result, "issuerCN", signInfo.issuerCN);
				addSignInfo(result, "serial", signInfo.serial);
				addSignInfo(result, "subject", signInfo.subject);
				addSignInfo(result, "subjCN", signInfo.subjCN);
				addSignInfo(result, "subjOrg", signInfo.subjOrg);
				addSignInfo(result, "subjOrgUnit", signInfo.subjOrgUnit);
				addSignInfo(result, "subjTitle", signInfo.subjTitle);
				addSignInfo(result, "subjState", signInfo.subjState);
				addSignInfo(result, "subjLocality", signInfo.subjLocality);
				addSignInfo(result, "subjFullName", signInfo.subjFullName);
				addSignInfo(result, "subjAddress", signInfo.subjAddress);
				addSignInfo(result, "subjPhone", signInfo.subjPhone);
				addSignInfo(result, "subjEMail", signInfo.subjEMail);
				addSignInfo(result, "subjDNS", signInfo.subjDNS);
				addSignInfo(result, "subjEDRPOUCode", signInfo.subjEDRPOUCode);
				addSignInfo(result, "subjDRFOCode", signInfo.subjDRFOCode);
				addSignInfo(result, "timestamp", signInfo.timeStamp ? signDate : String.Empty);
			}

			return String.Join("\r\n", result);
		}

		/// <summary>
		/// Не установлено автоматическую настройку в GLSIGN и не удалось определить АЦСК
		/// </summary>
		public const int EU_ERROR_DETECT_CA_FAILED = 0xFFFF;

		private static string getErrorDescription(int errorCode)
		{
			if (errorCode == 0)
			{
				return string.Empty;
			}

			switch (errorCode)
			{
				case -2:
					return "Не найдено действующих сертификатов";
				case EU_ERROR_DETECT_CA_FAILED:
					return "Не удалось определить центр сертификации";
			}

			if (errorCode > 0)
			{
				return IEUSignCP.GetErrorDesc(errorCode);
			}

			return "Неизвестная ошибка";
		}

		private static void addSignInfo(List<string> result, string key, string value)
		{
			result.Add(String.Format("{0}={1}", key, value));
		}

		/// <summary>
		/// Получить название АЦСК из подписи
		/// </summary>
		/// <returns></returns>
		private static string getAcksName(string fileNameOrSign, bool dataSign, out byte[] certificate)
		{
			var certInfo = getCertInfo(fileNameOrSign, dataSign, out certificate);
			return certInfo.issuerCN ?? string.Empty;
		}
		private static CASettings findCaByName(string acskName)
		{
			foreach (var authority in IitHelper.Cas)
			{
				if (authority.issuerCNs.Any(str => string.Compare(acskName, str, true) == 0))
				{
					return authority;
				}
			}

			return null;
		}

		private static IEUSignCP.EU_CERT_INFO_EX getCertInfo(string fileNameOrSign, bool data, out byte[] certificate)
		{
			IEUSignCP.EU_CERT_INFO_EX certInfo;
			certificate = new byte[8096];
			//IEUSignCP.GetFileSenderInfo
			int ret;
			if (!data)
			{
				ret = IEUSignCP.GetFileSignerInfo(0, fileNameOrSign, out certInfo, ref certificate);
			}
			else
			{
				ret = IEUSignCP.GetSignerInfo(0, fileNameOrSign, out certInfo, ref certificate);
			}
			if (ret != 0)
			{
				return default(IEUSignCP.EU_CERT_INFO_EX);
			}

			return certInfo;
		}
	}
}
