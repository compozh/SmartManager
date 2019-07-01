using System.Linq;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(Equipment))]
	public class EquipmentGraph: EfObjectGraphType<CommonDbContext, Equipment>
	{
		public EquipmentGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id"); 
			Field(x => x.Name);
			Field(x => x.FullName);
			Field(x => x.Designation);
			Field(x => x.FactoryNumber);
			Field(x => x.InstallDate, nullable:true);
			Field(x => x.Description, nullable:true);
			Field(x => x.UtilizationRate);
			Field(x => x.IsValid);
			Field(x => x.ResponsibleEmployeeId);
			Field(x => x.ItObjectId);
			Field(x => x.TypeId);
			Field(x => x.CategoryId);
			Field(x => x.StatusId);
			Field(x => x.DepartmentId, nullable:true);
			Field(x => x.ModelId);
			
			AddNavigationField(name: "department", resolve: context => context.Source.Department);
			AddNavigationField(name: "category", resolve: context => context.Source.Category);
			AddNavigationField(name: "status", resolve: context => context.Source.Status);
			AddNavigationField(name: "responsibleEmployee", resolve: context => context.Source.ResponsibleEmployee);
			AddNavigationField(name: "type", resolve: context => context.Source.Type);
			AddNavigationField(name: "model", resolve: context => context.Source.Model);
			AddNavigationField(name: "itObject",resolve: context => context.Source.ItObject);
			AddNavigationField(name: "currentMovementRecord",
				resolve: context => context.Source.MovementHistories.FirstOrDefault(mh => mh.EndDate == null),
				includeNames: new[] {"MovementHistories"});
			
			AddNavigationListField(name: "workRequests", resolve: context => context.Source.WorkRequests);
			AddNavigationConnectionField(name: "workRequestsConnection",
				resolve: context => context.Source.WorkRequests, includeNames: new[] {"WorkRequests"});
		}
	}
}