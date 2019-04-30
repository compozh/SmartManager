using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class WorkRequestCause : SimpleDictionaryRecord
	{
		public List<WorkRequest> WorkRequests { get; set; }
	}
}
