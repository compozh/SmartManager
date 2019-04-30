using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EquipmentStatus:SimpleDictionaryRecord
	{
		public List<Equipment> Equipments { get; set; }
		public List<TechnicalPlace> TechnicalPlaces { get; set; }
	}
}