using System.Linq;
using GraphQL.EntityFramework;
using GraphQL.Types;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequest))]
	public class WorkRequestGraph : EfObjectGraphType<CommonDbContext, WorkRequest>
	{
		public WorkRequestGraph(IEfGraphQLService<CommonDbContext> graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Content, true);
			Field(x => x.WorkRequestCategoryId, true);
			Field(x => x.WorkRequestDirectionId, true);
			Field(x => x.WorkRequestRepairTypeId, true);
			Field(x => x.Source, nullable:true, typeof(WorkRequestSourceGraph));
			Field(x => x.Status, nullable:true, typeof(WorkRequestStatusGraph));
			Field(x => x.StatusCode);
			Field(x => x.CreationDate, nullable:true, type:typeof(DateTimeGraphType));
			Field(x => x.StartDate, nullable: true, type:typeof(DateTimeGraphType));
			Field(x => x.EndDate, nullable: true, type:typeof(DateTimeGraphType));
			Field(x => x.FactDate, nullable: true, type:typeof(DateTimeGraphType));
			Field(x => x.DepartmentId, nullable: true);
			Field(x => x.ResponsibleDepartmentId, nullable: true);
			Field(x => x.DeclarerEmployeeId, true);
			Field(x => x.ResponsibleEmployeeId, true);
			Field(x => x.PerformerEmployeeId, true);
			Field(x => x.ItObjectId, true);
			Field(x => x.IsValid);
			
			AddNavigationField(name: "department", resolve: context => context.Source.Department);
			AddNavigationField(name: "responsibleDepartment", resolve: context => context.Source.ResponsibleDepartment);
			AddNavigationField(name: "category", resolve: context => context.Source.Category);
			AddNavigationField(name: "direction", resolve: context => context.Source.Direction);
			AddNavigationField(name: "repairType", resolve: context => context.Source.RepairType);
			AddNavigationField(name: "declarerEmployee", resolve: context => context.Source.DeclarerEmployee);
			AddNavigationField(name: "responsibleEmployee", resolve: context => context.Source.ResponsibleEmployee);
			AddNavigationField(name: "performerEmployee", resolve: context => context.Source.PerformerEmployee);
			AddNavigationField(name: "itObject", resolve: context => context.Source.ItObject);
			AddNavigationField(name: "equipment", resolve: context => context.Source.Equipment);
			AddNavigationField(name: "equipmentModel", resolve: context => context.Source.EquipmentModel);
			AddNavigationField(name: "technicalPlace",resolve: context => context.Source.TechnicalPlace);
			
			AddNavigationListField(name: "attachments",resolve: context => context.Source.Attachments);
			AddNavigationListField(name: "images",
				resolve: context =>
					context.Source.Attachments.Where(a => EamQuery.SupportedImageTypes.Contains(a.FileExtension)),
				includeNames: new[] {"Attachments"});
			
			Field("imagesCount", x => x.Attachments.Count(a => EamQuery.SupportedImageTypes.Contains(a.FileExtension)));
		}
	}
}
