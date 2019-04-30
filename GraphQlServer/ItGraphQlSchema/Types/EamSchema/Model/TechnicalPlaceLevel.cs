using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class TechnicalPlaceLevel : SimpleDictionaryRecord
	{
		public List<TechnicalPlace> TechnicalPlaces { get; set; }
	}
}