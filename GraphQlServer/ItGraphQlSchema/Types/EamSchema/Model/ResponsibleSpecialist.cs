using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	class Specialist
	{
		public string Id { get; set; }

		public WorkRequestDirection Direction { get; set; }

		public Employee Employee { get; set; }

		public bool IsResponsible { get; set; }
	}
}
