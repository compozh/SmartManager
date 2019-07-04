using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EquipmentAttachment : Attachment
	{
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual string Key { get; set; }
		
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual string EquipmentId { get; set; }
		public virtual Equipment Equipment { get; set; }
 	}
}