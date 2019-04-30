using System.Linq;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.EamSchema;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types
{
	[AtributeAddInDI]
	public class EamQuery : QueryGraphType
	{
		public EamQuery(IEfGraphQLService efGraphQlService) :
			base(efGraphQlService)
		{
			Name = "EamQuery";

			AddQueryField(
				name: "workRequests",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.WorkRequests;
				});

			AddQueryField(
				name: "workRequestCategories",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.WorkRequestCategories;
				});

			AddQueryField(
				name: "workRequestDirections",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.WorkRequestDirections;
				});

			AddQueryField(
				name: "workRequestRepairTypes",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.WorkRequestRepairTypes;
				});

			AddQueryField(
				name: "equipmentCategories",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentCategories;
				});

			AddQueryField(
				name: "equipmentStatuses",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentStatuses;
				});

			AddQueryField(
				name: "equipmentTypes",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentTypes;
				});

			AddQueryField(
				name: "technicalPlaceLevels",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.TechnicalPlaceLevels;
				});

			AddQueryField(
				name: "equipmentModels",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentModels;
				});

			AddQueryField(
				name: "equipmentModelGroups",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentModelGroups;
				});

			AddQueryField(
				name: "technicalPlaces",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.TechnicalPlaces;
				});

			AddQueryField(
				name: "equipments",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.Equipments;
				});

			AddQueryField(
				name: "equipmentMovementHistories",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentMovementHistories.Where(m => m.EndDate == null);
				});

			AddQueryField(
				name: "employees",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.Employees;
				});

			AddQueryField(
				name: "itObjects",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.ItObjects;
				});

			AddQueryField(
				name: "departments",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.Departments;
				});

			AddQueryConnectionField(
				name: "departmentConnection",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.Departments;
				});
			AddQueryConnectionField(
				name: "equipmentModelsConnection",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.EquipmentModels;
				});
			AddQueryConnectionField(
				name: "workRequestConnection",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.WorkRequests;
				});
			AddQueryConnectionField(
				name: "employeesConnection",
				resolve: context =>
				{
					var dbContext = ((HttpContext) context.UserContext).RequestServices
						.GetRequiredService<EamContext>();
					return dbContext.Employees;
				});
		}
	}
}
