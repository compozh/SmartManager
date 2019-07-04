using ItGraphQlSchema.Types.EamSchema;
using Microsoft.EntityFrameworkCore;

namespace ItGraphQlSchema.Types
{
	public class EamDbContext : CommonDbContext
	{
		public DbSet<WorkRequest> WorkRequests { get; set; }
		public DbSet<WorkRequestCategory> WorkRequestCategories { get; set; }
		public DbSet<WorkRequestRepairType> WorkRequestRepairTypes { get; set; }
		public DbSet<WorkRequestDirection> WorkRequestDirections { get; set; } 
		public DbSet<TechnicalPlace> TechnicalPlaces { get; set; }
		public DbSet<TechnicalPlaceLevel> TechnicalPlaceLevels { get; set; }
		public DbSet<Equipment> Equipments { get; set; }
		public DbSet<EquipmentType> EquipmentTypes { get; set; }
		public DbSet<EquipmentStatus> EquipmentStatuses { get; set; }
		public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
		public DbSet<EquipmentMovementHistory> EquipmentMovementHistories { get; set; }
		public DbSet<EquipmentFailureReason> EquipmentFailureReasons { get; set; }
		public DbSet<EquipmentFailureType> EquipmentFailureTypes { get; set; }
		public DbSet<ConditionParameterType> ConditionParameterTypes { get; set; }
		public DbSet<ConditionParameter> ConditionParameters { get; set; }
		public DbSet<ConditionParameterValue> ConditionParameterValues { get; set; }
		public DbSet<ConditionParameterValueRange> ConditionParameterValueRanges { get; set; }
		public DbSet<ConditionParameterToModelLink> ConditionParameterToModelLinks { get; set; }
		public DbSet<ConditionParameterAdditionalData> ConditionParameterAdditionalData { get; set; }
		public DbSet<ResponsibleSpecialist> ResponsibleSpecialists { get; set; }
		public DbSet<EquipmentAttachment> EquipmentAttachments { get; set; }
		public DbSet<WorkRequestAttachment> WorkRequestAttachments { get; set; }

		public EamDbContext(DbContextOptions<EamDbContext> options) :
			base(options)
		{
		}
	}
}
