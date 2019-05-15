using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Common
{
	[Table("OBJ")]
	public class ItObject
	{
		[Key, Column("KOBJ")]
		public string Id { get; set; }

		[Column("NOBJ")]
		public string Name { get; set; }
		
		public List<Employee> Employees { get; set; }
//		public List<WorkRequest> WorkRequests { get; set; }
//		public List<TechnicalPlace> TechnicalPlaces { get; set; }
//		public List<Equipment> Equipments { get; set; }
	}
}