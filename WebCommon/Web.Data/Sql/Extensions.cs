using System.Data.Common;

namespace Web.Data
{
	/// <summary>
	/// Расширяющие методы для класса SqlClient
	/// </summary>
	public static class Extensions
	{
//		/// <summary>
//		/// Добавить параметр в запрос
//		/// </summary>
//		/// <param name="parameters">Коллекция параметров</param>
//		/// <param name="paramName">Имя параметра</param>
//		/// <param name="value">Значение параметра</param>
//		public static void Add(this DbParameterCollection parameters, string paramName, object value)
//		{
//			parameters.Add(parameters.Instance.CreateParameter(paramName, value));
//		}

		///// <summary>
		///// Добавить параметр в запрос
		///// </summary>
		///// <param name="parameters">Коллекция параметров</param>
		///// <param name="paramName">Имя параметра</param>
		///// <param name="value">Значение параметра</param>
		//public static void Add(this DbParameterCollection parameters, string paramName, object value, SqlClient.DbParameterType type)
		//{
		//	parameters.Add(SqlClient.Instance.CreateParameter(paramName, value, type));
		//}
//
//		/// <summary>
//		/// Добавить параметр в запрос
//		/// </summary>
//		/// <param name="parameters">Коллекция параметров</param>
//		/// <param name="paramName">Имя параметра</param>
//		/// <param name="value">Значение параметра</param>
//		public static void AddNullable(this DbParameterCollection parameters, string paramName, object value)
//		{
//			if (value is string)
//			{
//				value = string.IsNullOrEmpty((string)value) ? " " : value;
//			}
//			parameters.Add(paramName, value);
//		}
	}
}