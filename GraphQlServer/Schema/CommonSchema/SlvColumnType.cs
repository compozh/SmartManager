using System;
using System.Collections.Generic;
using System.Text;

namespace SkdScheme.CommonSchema
{
	public enum SlvColumnType
	{
		/// <summary>
		/// Символьный CharType
		/// </summary>
		Char,

		/// <summary>
		/// Числовой NumericType
		/// </summary>
		Numeric,

		/// <summary>
		/// Дата DateType
		/// </summary>
		Date,

		/// <summary>
		/// Дата-время DateTimeType
		/// </summary>
		DateTime,

		/// <summary>
		/// Memo (M) Memo
		/// </summary>
		Memo,

		/// <summary>
		/// Guid GuidType
		/// </summary>
		Guid,
		/// <summary>
		/// Любые другие типы, в результате будут StringGraphType()
		/// </summary>
		ANY
	}
}
