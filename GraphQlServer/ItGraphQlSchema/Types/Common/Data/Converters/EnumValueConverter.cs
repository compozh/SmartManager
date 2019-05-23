using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace ItGraphQlSchema.Types.Common
{
	public class EnumValueConverter<TEnum, TValue> : ValueConverter<TEnum, TValue> 
		where TEnum : System.Enum  
	{
		public EnumValueConverter() : 
			base(v => v.GetMappedValue<TValue>(), 
				v => EnumMapper.GetEnumFromMappedValue<TEnum>(v))
		{
		}
	}
}