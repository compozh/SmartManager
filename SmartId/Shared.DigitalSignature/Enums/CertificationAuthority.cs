using System;
using System.Collections.Generic;
using System.Text;

namespace Shared.DigitalSignature.Enums
{
	/// <summary>
	/// Центры сертификации ключей
	/// </summary>
	public enum CertificationAuthority
	{
		/// <summary>
		/// ООО «Юкрейн Проперти Групп»
		/// </summary>
		Upg,
		/// <summary>
		/// Альтерсайн
		/// </summary>
		AlterSign,
		/// <summary>
		/// ИИТ (аппаратный ключ)
		/// </summary>
		Iit,
		/// <summary>
		/// ИИТ (аппаратный ключ)
		/// </summary>
		IitAlmaz,
		/// <summary>
		/// ИИТ (ключ в виде файла)
		/// </summary>
		IitFile,
		/// <summary>
		/// ИИТ (любой ключ)
		/// </summary>
		IitAny
	}
}
