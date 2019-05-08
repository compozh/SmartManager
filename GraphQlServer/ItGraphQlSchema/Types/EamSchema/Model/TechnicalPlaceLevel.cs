using System.Collections.Generic;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class TechnicalPlaceLevel : SimpleDictionaryRecord
	{
		public List<TechnicalPlace> TechnicalPlaces { get; set; }
	}
}