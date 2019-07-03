using System.Linq;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.EamSchema;

namespace ItGraphQlSchema.Types
{
	[AddInDI]
	public class EamQuery : QueryGraphType<CommonDbContext>
	{
		private readonly IEamDataProvider _dataProvider;

		public EamQuery(IEfGraphQLService<CommonDbContext> efGraphQlService, IEamDataProvider dataProvider) :
			base(efGraphQlService)
		{
			_dataProvider = dataProvider;
			Name = "EamQuery";

			AddQueryField(name: "workRequests", resolve: context => _dataProvider.WorkRequests);
			AddQueryConnectionField(name: "workRequestConnection",resolve: context =>_dataProvider.WorkRequests);

			AddQueryField(name: "technicalPlaces",resolve: context =>_dataProvider.TechnicalPlaces);
			AddQueryConnectionField(name: "technicalPlacesConnection",resolve: context =>_dataProvider.TechnicalPlaces);
			
			AddQueryField(name: "equipmentTypes",resolve: context => _dataProvider.EquipmentTypes);
			AddQueryField(name: "equipments",resolve: context =>_dataProvider.Equipments);
			AddQueryConnectionField(name: "equipmentsConnection",resolve: context =>_dataProvider.Equipments);
			AddSingleField(name: "equipment", resolve: context =>_dataProvider.Equipments);
			AddQueryField(name: "equipmentMovementHistories",resolve: context =>_dataProvider.EquipmentMovementHistories.Where(m => m.EndDate == null));
			
			AddQueryField(name: "equipmentModelGroups",resolve: context =>_dataProvider.ResourcesGroups);
			AddQueryField(name: "equipmentModels",resolve: context =>_dataProvider.EquipmentModels);
			AddQueryConnectionField(name: "equipmentModelsConnection",resolve: context =>_dataProvider.EquipmentModels);
			
			AddQueryField(name: "conditionParameterTypes",resolve: context =>_dataProvider.ConditionParameterTypes);
			AddQueryField(name: "conditionParameters",resolve: context =>_dataProvider.ConditionParameters);
			AddQueryField(name: "conditionParameterValues",resolve: context =>_dataProvider.ConditionParameterValues);
			AddQueryConnectionField(name: "conditionParameterValuesConnection",resolve: context =>_dataProvider.ConditionParameterValues);
			
			AddQueryField(name: "downTimes",resolve: context =>_dataProvider.DownTimes);
			AddQueryConnectionField(name: "downTimesConnection",resolve: context =>_dataProvider.DownTimes);
			
			//Справочники
			AddQueryField(name: "workRequestCategories",resolve: context => _dataProvider.WorkRequestCategories);
			AddQueryField(name: "workRequestDirections",resolve: context =>_dataProvider.WorkRequestDirections);
			AddQueryField(name: "workRequestRepairTypes",resolve: context =>_dataProvider.WorkRequestRepairTypes);
			AddQueryField(name: "equipmentCategories",resolve: context =>_dataProvider.EquipmentCategories);
			AddQueryField(name: "equipmentStatuses",resolve: context => _dataProvider.EquipmentStatuses);
			AddQueryField(name: "technicalPlaceLevels",resolve: context =>_dataProvider.TechnicalPlaceLevels);
			AddQueryField(name: "equipmentFailureReasons",resolve: context =>_dataProvider.EquipmentFailureReasons);
			AddQueryField(name: "equipmentFailureTypes",resolve: context =>_dataProvider.EquipmentFailureTypes);
			
			// Общие данные
			AddQueryField(name: "employees",resolve: context => _dataProvider.Employees);
			AddQueryConnectionField(name: "employeesConnection",resolve: context => _dataProvider.Employees);
			AddQueryField(name: "itObjects",resolve: context => _dataProvider.ItObjects);
			AddQueryField(name: "departments",resolve: context => _dataProvider.Departments);
			AddQueryConnectionField(name: "departmentConnection",resolve: context => _dataProvider.Departments);
			AddQueryField(name: "measurementUnits",resolve: context => _dataProvider.MeasurementUnits);
			AddQueryConnectionField(name: "measurementUnitsConnection",resolve: context => _dataProvider.MeasurementUnits);
			
			AddQueryField(name: "attachments", resolve:
				context => context.Arguments.ContainsKey("id")
							|| context.Arguments.ContainsKey("ids")
							|| context.Arguments.ContainsKey("where")
					? _dataProvider.Attachments
					: _dataProvider.Attachments.Take(30));
			AddQueryConnectionField(name: "attachmentsConnection", resolve:
				context => context.Arguments.ContainsKey("first")
							|| context.Arguments.ContainsKey("ids")
							|| context.Arguments.ContainsKey("where")
					? _dataProvider.Attachments
					: _dataProvider.Attachments.Take(30));
		}
	}
}
