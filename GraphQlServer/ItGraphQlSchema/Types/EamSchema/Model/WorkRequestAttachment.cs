using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestAttachment : Attachment
	{
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual string Key { get; set; }
		
		[Column("KDOR")]
		[MaxLength(254)]
		public virtual int WorkRequestId { get; set; }
		public virtual WorkRequest WorkRequest  { get; set; }
 	}
}