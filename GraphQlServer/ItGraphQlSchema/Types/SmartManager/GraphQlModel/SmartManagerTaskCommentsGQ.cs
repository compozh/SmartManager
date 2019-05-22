using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AddInDIAttribute]
	public class SmartManagerTaskCommentsGQ : ObjectGraphType<SmartManagerTaskComment>
	{
		public SmartManagerTaskCommentsGQ()
		{
			Name = "Comments";
			Field(p => p.User);
			Field(p => p.Text);
			Field(p => p.Date);
		}
	}
}
