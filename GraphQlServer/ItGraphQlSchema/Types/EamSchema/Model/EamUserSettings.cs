using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDIAttribute]
	public class EamUserSettings
	{
		public List<string> AvailableItObjects { get; set; }

		public List<int> AvailableDepartments { get; set; }

		public RegAccess WorkRequestsAccess { get; set; }

		public RegAccess EquipmentsAccess { get; set; }

		public RegAccess TechnicalPlacesAccess { get; set; }

		public RegAccess EquipmentTypesAccess { get; set; }

		public RegAccess EquipmentModelsAccess { get; set; }
	}

	public enum RegAccess
	{
		Deny = -1,
		View = 0,
		Edit = 1
	}
}