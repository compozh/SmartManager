using GraphQL.Types;
using System;

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
	
	public class SmartManagerTaskOriginals
	{
		public int Id { get; set; }
		public int Ndor { get; set; }
		public string FileName { get; set; }
		public string User { get; set; }
		public DateTime date { get; set; }
		public string Comm { get; set; }
		public string TypeName { get; set; }
		public string TypeDescription { get; set; }
		public string File { get; set; }
	}
}
