using GraphQL.Types;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.LMS
{
	/// <summary>
	/// LMS. Свойство фильтра как: продукт, роль, уровень сложности
	/// </summary>
	[AddInDI]
	public class FilterProperty : ObjectGraphType<FilterProperty>
	{
		[JsonProperty("name")]
		public string PropertyName { get; set; }
		[JsonProperty("code")]
		public string PropertyValue { get; set; }

		public FilterProperty()
		{
			Field("name", p => p.PropertyName, nullable: true);
			Field("code", p => p.PropertyValue, nullable: true);
		}
	}
}
