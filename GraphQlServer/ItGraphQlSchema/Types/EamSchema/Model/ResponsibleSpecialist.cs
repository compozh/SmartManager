using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("RZSPEC")]
	public class ResponsibleSpecialist
	{
		[Key, Column("UNRZSPEC")]
		public int Id { get; set; }

		[Column("KRZNPR")]
		public string DirectionId { get; set; }
		public WorkRequestDirection Direction { get; set; }

		[Column("N_KDK")]
		public string EmployeeId { get; set; }
		public Employee Employee { get; set; }
		
		[Column("UNRKP")]
		public int? TechnicalPlaceId { get; set; }
		public TechnicalPlace TechnicalPlace { get; set; }

		[Column("PR_OTV")]
		public bool IsResponsible { get; set; }
	}
}
