using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager.GraphQlModel
{
	[AtributeAddInDI]
	class SmartManagerTaskOriginalGQ : ObjectGraphType<SmartManagerTaskOriginals>
	{
		public SmartManagerTaskOriginalGQ()
		{
			Name = "Originals";
			Field(p => p.FileName);
			Field(p => p.Id);
			Field(p => p.Comm);
			Field(p => p.Fileext);
			Field(p => p.IsMy);
			Field(p => p.IsSign);
			Field(p => p.Filesize);
			Field(p => p.Ndor);
			Field(p => p.Type);
			Field(p => p.TypeDescription);
			Field(p => p.TypeName);
			Field(p => p.User);
			Field(p => p.date);

		}
	}
}
