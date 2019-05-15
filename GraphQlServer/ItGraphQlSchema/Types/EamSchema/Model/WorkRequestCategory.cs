using System.Collections.Generic;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestCategory : SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
	}
}
