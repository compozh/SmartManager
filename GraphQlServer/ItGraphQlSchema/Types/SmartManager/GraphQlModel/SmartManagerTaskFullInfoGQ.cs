using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.GraphQlModel;
using ItGraphQlSchema.Types.SmartManager.Model;

namespace ItGraphQlSchema.Types.SmartManager
{
	
	[AtributeAddInDI]
	public class SmartManagerTaskFullInfoGQ : ObjectGraphType<SmartManagerTaskFullInfo>
	{
		public SmartManagerTaskFullInfoGQ(SmartManagerProvider provider)
		{
			Name = "TasksGetInfo";
			Field(p => p.Name).Description("Имя");
			Field(p => p.Id).Description("Идентификатор");
			Field(p => p.Dateplan).Description("Плановая дата");
			Field(p => p.Descript);
			Field(p => p.DateAdd);
			Field(p => p.Arso);
			Field(p => p.KeyValue);
			Field(p => p.Status);
			Field(p => p.AddedFio);
			Field(p => p.AddedPhoto);
			Field(p => p.AddedId);
			Field(p => p.DateFact);
			Field(p => p.DateRemind);
			Field(p => p.IsAgree);
			Field(p => p.DocPlandate);
			Field(p => p.Priority);
			// Вложенные объекты 
			Field<ListGraphType<SmartManagerTaskOriginalGQ>>("Originals", resolve: context => context.Source.Originals);
			Field<ListGraphType<SmartManagerTaskCommentsGQ>>("Comments", resolve: context => context.Source.Comments); 
		}
	}
}
