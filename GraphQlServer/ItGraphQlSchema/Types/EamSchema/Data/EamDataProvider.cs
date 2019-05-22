using System.Linq;
using ItGraphQlSchema.Types.Common;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema.Types.EamSchema
{
	public interface IEamDataProvider : ICommonDataProvider
	{
		IQueryable<WorkRequest> WorkRequests { get; }
		IQueryable<WorkRequestCategory> WorkRequestCategories { get; }
		IQueryable<WorkRequestRepairType> WorkRequestRepairTypes { get; }
		IQueryable<WorkRequestDirection> WorkRequestDirections { get; }
		IQueryable<Equipment> Equipments { get; }
		IQueryable<TechnicalPlace> TechnicalPlaces { get; }
		IQueryable<EquipmentType> EquipmentTypes { get; }
		//IQueryable<EquipmentModel> EquipmentModels { get; }
		//IQueryable<EquipmentModelGroup> EquipmentModelGroups { get; }
		IQueryable<EquipmentStatus> EquipmentStatuses { get; }
		IQueryable<EquipmentCategory> EquipmentCategories { get; }
		IQueryable<TechnicalPlaceLevel> TechnicalPlaceLevels { get; }
		IQueryable<EquipmentMovementHistory> EquipmentMovementHistories { get; }
		
		IQueryable<ConditionParameterType> ConditionParameterTypes { get; }
		
		IQueryable<ConditionParameter> ConditionParameters { get;  }
		
		IQueryable<ConditionParameterValue> ConditionParameterValues { get; }

		IQueryable<EquipmentFailureReason> EquipmentFailureReasons { get;  }
		
		IQueryable<EquipmentFailureType> EquipmentFailureTypes { get;  }
		
		IQueryable<ConditionParameterToModelLink> ConditionParameterToModelLinks { get;  }
		
		IQueryable<ConditionParameterValue> DownTimes { get; }
		
		IQueryable<MeasurementUnit> MeasurementUnits { get; }
	}
	
	[AddInDI(typeof(IEamDataProvider))]
	internal class EamDataProvider : CommonDataProvider, IEamDataProvider
	{
		private readonly IEamUserSettingsProvider _userSettingsProvider;

		public EamDataProvider(IHttpContextAccessor httpContextAccessor, IEamUserSettingsProvider userSettingsProvider) 
			: base(httpContextAccessor)
		{
			_userSettingsProvider = userSettingsProvider;
		}

		private EamUserSettings UserSettings => _userSettingsProvider.GetCurrentSettings().Result;

		public IQueryable<WorkRequest> WorkRequests
		{
			get
			{
				return DbContext.WorkRequests.Where(wr => UserSettings.WorkRequestsAccess != RegAccess.Deny
														&& UserSettings.AvailableItObjects.Contains(wr.ItObjectId)
														&& (wr.DepartmentId == null ||
															UserSettings.AvailableDepartments.Contains(
																(int) wr.DepartmentId)));
			}
		}

		public IQueryable<WorkRequestCategory> WorkRequestCategories => DbContext.WorkRequestCategories;
		public IQueryable<WorkRequestRepairType> WorkRequestRepairTypes => DbContext.WorkRequestRepairTypes;
		public IQueryable<WorkRequestDirection> WorkRequestDirections => DbContext.WorkRequestDirections;

		public IQueryable<Equipment> Equipments
		{
			get
			{
				return DbContext.Equipments.Where(eq => UserSettings.EquipmentsAccess != RegAccess.Deny
														&& (string.IsNullOrEmpty(eq.ItObjectId) ||
															UserSettings.AvailableItObjects.Contains(eq.ItObjectId))
														&& (eq.DepartmentId == null ||
															UserSettings.AvailableDepartments.Contains(
																(int) eq.DepartmentId)));
			}
		}

		public IQueryable<TechnicalPlace> TechnicalPlaces
		{
			get
			{
				return DbContext.TechnicalPlaces.Where(tp => UserSettings.TechnicalPlacesAccess != RegAccess.Deny
															&& string.IsNullOrEmpty(tp.ItObjectId) ||
															UserSettings.AvailableItObjects.Contains(tp.ItObjectId) &&
															(tp.DepartmentId == null ||
															UserSettings.AvailableDepartments.Contains(
																(int) tp.DepartmentId)));
			}
		}

		public IQueryable<EquipmentType> EquipmentTypes
		{
			get { return DbContext.EquipmentTypes.Where(et => UserSettings.EquipmentTypesAccess != RegAccess.Deny); }
		}

		//public IQueryable<EquipmentModel> EquipmentModels
		//{
		//	get { return DbContext.EquipmentModels.Where(em => UserSettings.EquipmentModelsAccess != RegAccess.Deny); }
		//}
		//
		//public IQueryable<EquipmentModelGroup> EquipmentModelGroups => DbContext.EquipmentModelGroups;
		public IQueryable<EquipmentStatus> EquipmentStatuses => DbContext.EquipmentStatuses;
		public IQueryable<EquipmentCategory> EquipmentCategories => DbContext.EquipmentCategories;
		public IQueryable<TechnicalPlaceLevel> TechnicalPlaceLevels => DbContext.TechnicalPlaceLevels;
		public IQueryable<EquipmentMovementHistory> EquipmentMovementHistories
		{
			get
			{
				return DbContext.EquipmentMovementHistories.Where(emh =>
					UserSettings.EquipmentsAccess != RegAccess.Deny &&
					UserSettings.TechnicalPlacesAccess != RegAccess.Deny);
			}
		}

		public IQueryable<ConditionParameterType> ConditionParameterTypes => DbContext.ConditionParameterTypes;
		public IQueryable<ConditionParameter> ConditionParameters => DbContext.ConditionParameters;

		public IQueryable<ConditionParameterValue> ConditionParameterValues => DbContext.ConditionParameterValues.Where(
			c => c.ConditionParameter != null && c.ConditionParameter.ConditionParameterType != null &&
				(c.ConditionParameter.ConditionParameterType.ParameterGroup ==
				ConditionParameterGroup.OperatingStatistics ||
				c.ConditionParameter.ConditionParameterType.ParameterGroup ==
				ConditionParameterGroup.IntegrationAsuTp));
		
		public IQueryable<EquipmentFailureReason> EquipmentFailureReasons => DbContext.EquipmentFailureReasons;
		public IQueryable<EquipmentFailureType> EquipmentFailureTypes => DbContext.EquipmentFailureTypes;
		public IQueryable<ConditionParameterToModelLink> ConditionParameterToModelLinks => DbContext.ConditionParameterToModelLinks;
		public IQueryable<ConditionParameterValue> DownTimes => DbContext.ConditionParameterValues.Where(
			c => c.ConditionParameter != null && c.ConditionParameter.ConditionParameterType != null &&
				(c.ConditionParameter.ConditionParameterType.ParameterGroup ==
				ConditionParameterGroup.DowntimeEquipment ));

		public override IQueryable<ItObject> ItObjects =>
			base.ItObjects.Where(ito => UserSettings.AvailableItObjects.Contains(ito.Id));
		public override IQueryable<Employee> Employees =>
			base.Employees.Where(emp => UserSettings.AvailableItObjects.Contains(emp.ItObjectId));
	}
}