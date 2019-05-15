using System.Collections.Generic;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EquipmentCategory : SimpleDictionaryRecord
	{
		public List<Equipment> Equipments { get; set; }
		public List<TechnicalPlace> TechnicalPlaces { get; set; }
	}
}
