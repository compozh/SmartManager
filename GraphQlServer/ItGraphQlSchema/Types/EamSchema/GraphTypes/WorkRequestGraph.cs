using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	public class WorkRequestGraph : EfObjectGraphType<WorkRequest>
	{
		public WorkRequestGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Content, true);
			Field(x => x.WorkRequestCategoryId, true);
			Field(x => x.WorkRequestDirectionId, true);
			Field(x => x.WorkRequestRepairTypeId, true);
			Field<WorkRequestSourceGraph>("Source");
			Field<WorkRequestStatusGraph>("Status");
			Field(x => x.CreationDate, nullable: true);
			Field(x => x.StartDate, nullable: true);
			Field(x => x.EndDate, nullable: true);
			Field(x => x.FactDate, nullable: true);
			Field(x => x.DepartmentId, nullable: true);
			Field(x => x.ResponsibleDepartmentId, nullable: true);
			Field(x => x.DeclarerEmployeeId, true);
			Field(x => x.ResponsibleEmployeeId, true);
			Field(x => x.PerformerEmployeeId, true);
			Field(x => x.ItObjectId, true);
			Field(x => x.IsValid);
			AddNavigationField(
				name: "department",
				resolve: context => context.Source.Department,
				typeof(DepartmentGraph));
			AddNavigationField(
				name: "responsibleDepartment",
				resolve: context => context.Source.ResponsibleDepartment,
				typeof(DepartmentGraph));
			AddNavigationField(
				name: "category",
				resolve: context => context.Source.Category,
				typeof(WorkRequestCategoryGraph));
			AddNavigationField(
				name: "direction",
				resolve: context => context.Source.Direction,
				typeof(WorkRequestDirectionGraph));
			AddNavigationField(
				name: "repairType",
				resolve: context => context.Source.RepairType,
				typeof(WorkRequestRepairTypeGraph));
			AddNavigationField(
				name: "declarerEmployee",
				resolve: context => context.Source.DeclarerEmployee,
				typeof(EmployeeGraph));
			AddNavigationField(
				name: "responsibleEmployee",
				resolve: context => context.Source.ResponsibleEmployee,
				typeof(EmployeeGraph));
			AddNavigationField(
				name: "performerEmployee",
				resolve: context => context.Source.PerformerEmployee,
				typeof(EmployeeGraph));
			AddNavigationField(
				name: "itObject",
				resolve: context => context.Source.ItObject,
				typeof(ItObjectGraph));
			AddNavigationField(
				name: "equipment",
				resolve: context => context.Source.Equipment,
				typeof(EquipmentGraph));
			AddNavigationField(
				name: "equipmentModel",
				resolve: context => context.Source.EquipmentModel,
				typeof(EquipmentModelGraph));
		}
	}
}
