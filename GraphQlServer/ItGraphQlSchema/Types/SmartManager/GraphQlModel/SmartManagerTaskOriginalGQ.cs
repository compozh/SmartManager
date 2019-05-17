using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

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
			Field(p => p.Ndor);
			Field(p => p.TypeDescription);
			Field(p => p.TypeName);
			Field(p => p.User);
			Field(p => p.date);
			Field(p => p.File);
		}
	}
}
