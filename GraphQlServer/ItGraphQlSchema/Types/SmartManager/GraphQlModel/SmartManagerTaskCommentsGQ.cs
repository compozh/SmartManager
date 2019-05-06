using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;
using System;
using System.Collections.Generic;
using System.Text;

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
}
