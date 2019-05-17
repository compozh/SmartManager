using GraphQL.Types;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AtributeAddInDI]
	public class SmartManagerTaskParticipantsGQ : ObjectGraphType<SmartManagerTaskParticipants>
	{
		public SmartManagerTaskParticipantsGQ()
		{
			Name = "Participants";
			Field(p => p.UserId);
			Field(p => p.UserFio);
			Field(p => p.Role);
		}
	}
	
	public class SmartManagerTaskParticipants
	{
		public string UserId { get; set; }
		public string UserFio { get; set; }
		public string Role { get; set; }
	}
}
