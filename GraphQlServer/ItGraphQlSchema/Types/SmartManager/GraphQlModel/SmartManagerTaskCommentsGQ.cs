using GraphQL.Types;
using System;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AtributeAddInDI]
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
	
	public class SmartManagerTaskComment
	{
		public string User { get; set; }
		public DateTime Date { get; set; }
		public string Text { get; set; }
	}
}
