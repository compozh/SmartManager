using GraphQL;
using GraphQL.EntityFramework;
using GraphQL.Types;
using GraphQL.Utilities;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.EamSchema.GraphTypes;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AtributeAddInDI]
	class EamSchema : Schema
	{
		public EamSchema(IDependencyResolver resolver) :
		base(resolver)
		{
			Query = resolver.Resolve<EamQuery>();
		}
		
		public static void Config(IServiceCollection services, IConfiguration configuration)
		{
			services.AddDbContext<EamDbContext>(options =>
				options.UseSqlServer(configuration["ConnectionStrings:Connection:ConnectionString"]));
			
			EfGraphQLConventions.RegisterInContainer(services, EamDbContext.DataModel);
			GraphTypeTypeRegistry.Register<WorkRequest, WorkRequestGraph>();
			GraphTypeTypeRegistry.Register<WorkRequestCategory, WorkRequestCategoryGraph>();
			GraphTypeTypeRegistry.Register<WorkRequestDirection, WorkRequestDirectionGraph>();
			GraphTypeTypeRegistry.Register<WorkRequestRepairType, WorkRequestRepairTypeGraph>();
			GraphTypeTypeRegistry.Register<Department, DepartmentGraph>();
			GraphTypeTypeRegistry.Register<Employee, EmployeeGraph>();
			GraphTypeTypeRegistry.Register<WorkRequestStatus, WorkRequestStatusGraph>();
			GraphTypeTypeRegistry.Register<WorkRequestSource, WorkRequestSourceGraph>();
			GraphTypeTypeRegistry.Register<ItObject, ItObjectGraph>();
			GraphTypeTypeRegistry.Register<Equipment, EquipmentGraph>();
			GraphTypeTypeRegistry.Register<EquipmentType, EquipmentTypeGraph>();
			GraphTypeTypeRegistry.Register<EquipmentModel, EquipmentModelGraph>();
			GraphTypeTypeRegistry.Register<EquipmentStatus, EquipmentStatusGraph>();
			GraphTypeTypeRegistry.Register<EquipmentCategory, EquipmentCategoryGraph>();
			GraphTypeTypeRegistry.Register<EquipmentModelGroup, EquipmentModelGroupGraph>();
			GraphTypeTypeRegistry.Register<TechnicalPlace, TechnicalPlaceGraph>();
			GraphTypeTypeRegistry.Register<TechnicalPlaceLevel, TechnicalPlaceLevelGraph>();
			GraphTypeTypeRegistry.Register<EquipmentMovementHistory, EquipmentMovementHistoryGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterType, ConditionParameterTypeGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameter, ConditionParameterGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterValue, ConditionParameterValueGraph>();
			GraphTypeTypeRegistry.Register<EquipmentFailureReason, EquipmentFailureReasonGraph>();
			GraphTypeTypeRegistry.Register<EquipmentFailureType, EquipmentFailureTypeGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterToModelLink, ConditionParameterToModelLinkGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterGroup, ConditionParameterGroupGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterValueRange, ConditionParameterValueRangeGraph>();
			GraphTypeTypeRegistry.Register<ConditionParameterAdditionalData, ConditionParameterAdditionalDataGraph>();
			GraphTypeTypeRegistry.Register<MeasurementUnit, MeasurementUnitGraph>();

			services.AddSingleton<IEamUserSettingsProvider, EamUserSettingsProvider>();
			services.AddSingleton<IEamDataProvider, EamDataProvider>();
		}
	}
}
