using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ItGraphQlSchema.Types.EamSchema
{
	[Table("PRQV")]
	public class ConditionParameterType
	{
		[Key, Column("KPRQV")]
		public string Id { get; set; }

		[Column("PRQV_TYPE")]
		public ConditionParameterGroup ParameterGroup { get; set; }

		[Column("NPRQV")]
		public string Name { get; set; }
		
		[Column("NPRQV_S")]
		public string ShortName { get; set; }
		
		[Column("KGRUSTR_WR")]
		public string WriteAccessGroups { get; set; }
		
		[Column("KGRUSTR_RD")]
		public string ReadAccessGroups { get; set; }
		
		[Column("KRZNPR")]
		public string WorkRequestDirectionId { get; set; }
		public WorkRequestDirection WorkRequestDirection { get; set; }
		
		public List<ConditionParameter> ConditionParameters { get; set; }
	}
}