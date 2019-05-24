using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System;

namespace ItGraphQlSchema.Types.Common
{
	public class IsValidConverter : ValueConverter<bool, string>
	{
		/// <summary>
		/// Признак отмененной строки
		/// </summary>
		private const string CanceledValue = "О";
		
		public IsValidConverter() : base(v =>  v ? string.Empty : CanceledValue,
			v => string.IsNullOrWhiteSpace(v))
		{
		}
	}

	public class DecimalToIntegerConverter : ValueConverter<int, decimal>
	{
		public DecimalToIntegerConverter() : 
			base(i => Convert.ToDecimal(i), d=> Convert.ToInt32(d))
		{
		}
	}

	public class DecimalToLongConverter : ValueConverter<long, decimal>
	{
		public DecimalToLongConverter() :
			base(l => Convert.ToDecimal(l), d => Convert.ToInt64(d))
		{
		}
	}
}