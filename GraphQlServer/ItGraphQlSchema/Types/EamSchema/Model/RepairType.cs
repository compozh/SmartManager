using System.Collections.Generic;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestRepairType:SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
	}
}
