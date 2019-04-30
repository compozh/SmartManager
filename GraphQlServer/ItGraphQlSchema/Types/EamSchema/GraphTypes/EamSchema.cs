using GraphQL;
using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.EntityFramework;
using GraphQL.Types;
using GraphQL.Utilities;
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
		
		public static void Config(IServiceCollection services)
		{
			EfGraphQLConventions.RegisterInContainer(services, EamContext.DataModel);
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
		}
	}
}
