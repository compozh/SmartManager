using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.Common
{
	[Table("KDK")]
	public class Employee
	{
		[Key, Column("N_KDK")]
		public string Id { get; set; }

		[Column("FIO_OTV")]
		public string FullName { get; set; }

		[Column("NAM")]
		public string FirstName { get; set; }

		[Column("FAM")]
		public string SecondName { get; set; }

		[Column("OTCH")]
		public string MiddleName { get; set; }

		[Column("CEH")]
		public int? DepartmentId { get; set; }

		public Department Department { get; set; }

		[Column("KOBJ")]
		public string ItObjectId { get; set; }

		public ItObject ItObject { get; set; }

//		public List<WorkRequest> DeclarerWorkRequests { get; set; }
//
//		public List<WorkRequest> ResponcibleWorkRequests { get; set; }
//
//		public List<WorkRequest> PerformerWorkRequests { get; set; }
	}
}
