using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Models
{
	/// <summary>
	/// Типы информации о ключе
	/// </summary>
	public enum InfoTypes
	{
		/// <summary>
		/// ЦСК, выдавший сертификат
		/// </summary>
		Issuer,
		/// <summary>
		/// Реквизиты ЦСК, выдавшего сертификат
		/// </summary>
		IssuerCN,
		/// <summary>
		/// Серийный номер сертификата
		/// </summary>
		Serial,
		/// <summary>
		/// Имя владельца сертификата
		/// </summary>
		Subject,
		/// <summary>
		/// Реквизиты владельца сертификата
		/// </summary>
		SubjCN,
		/// <summary>
		/// Организация к которой принадлежит владелец сертификата
		/// </summary>
		SubjOrg,
		/// <summary>
		/// Подразделение организации к которой принадлежит владелец сертификата
		/// </summary>
		SubjOrgUnit,
		/// <summary>
		/// Должность владельца сертификата
		/// </summary>
		SubjTitle,
		/// <summary>
		/// Государство владельца сертификата
		/// </summary>
		SubjState,
		/// <summary>
		/// Населенный пункт владельца сертификата
		/// </summary>
		SubjLocality,
		/// <summary>
		/// Полное имя владельца сертификата
		/// </summary>
		SubjFullName,
		/// <summary>
		/// Адрес владельца сертификата
		/// </summary>
		SubjAddress,
		/// <summary>
		/// Телефон владельца сертификата
		/// </summary>
		SubjPhone,
		/// <summary>
		/// E-mail владельца сертификата
		/// </summary>
		SubjEMail,
		/// <summary>
		/// DNS-имя или иное технического средства
		/// </summary>
		SubjDNS,
		/// <summary>
		/// ЕДРПОУ код владельца сертификата
		/// </summary>
		SubjEDRPOUCode,
		/// <summary>
		/// ДРФО код владельца сертификата
		/// </summary>
		SubjDRFOCode,
		/// <summary>
		/// Метка времени (если метка времени не используется, то пусто)
		/// </summary>
		Timestamp,
		/// <summary>
		/// Начало действия сертификата владельца сертификата (если не удалось получить информацию, то пусто)
		/// </summary>
		CertBeginTime,
		/// <summary>
		/// Начало действия сертификата владельца сертификата (если не удалось получить информацию, то пусто)
		/// </summary>
		CertEndTime,
		/// <summary>
		/// Протокол проверки подписи
		/// </summary>
		Protocol,
		/// <summary>
		/// Протокол проверки подписи
		/// </summary>
		VerifyProtocol,
		/// <summary>
		/// Диагностический дамп настроек
		/// </summary>
		Dump
	}
}
