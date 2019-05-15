using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

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
}