using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Web.WebRequests;

namespace SmartId.Extensions
{
	/// <summary>
	/// Расширенные возможности веб расчетов
	/// </summary>
	public static class PureWebCalculationsExtentions
	{
		/// <summary>
		/// Добавить sql клиент для работы веб расчетов
		/// </summary>
		public static T Exec<T>(this PureWebCalculations webCalculations, string tiket, string calcId, object parameters) where T: new()
		{
			var settings = new JsonSerializerSettings { DateFormatHandling = DateFormatHandling.MicrosoftDateFormat };
			var args = JsonConvert.SerializeObject(parameters, settings);
			var requestResult = webCalculations.ExecuteEx(calcId, args, tiket);

			try
			{
				return JsonConvert.DeserializeObject<T>(requestResult);
			}
			catch {	}
			return new T();
		}
	}
}
