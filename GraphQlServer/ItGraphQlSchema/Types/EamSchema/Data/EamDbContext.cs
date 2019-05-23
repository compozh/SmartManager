using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.EamSchema;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ItGraphQlSchema.Types
{
	public sealed partial class CommonDbContext : DbContext
	{
		public DbSet<WorkRequest> WorkRequests { get; set; }
		public DbSet<WorkRequestCategory> WorkRequestCategories { get; set; }
		public DbSet<WorkRequestRepairType> WorkRequestRepairTypes { get; set; }
		public DbSet<WorkRequestDirection> WorkRequestDirections { get; set; } 
		public DbSet<Equipment> Equipments { get; set; }
		public DbSet<TechnicalPlace> TechnicalPlaces { get; set; }
		public DbSet<EquipmentType> EquipmentTypes { get; set; }
		//public DbSet<EquipmentModel> EquipmentModels { get; set; }
		//public DbSet<EquipmentModelGroup> EquipmentModelGroups { get; set; }
		public DbSet<EquipmentStatus> EquipmentStatuses { get; set; }
		public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
		public DbSet<TechnicalPlaceLevel> TechnicalPlaceLevels { get; set; }
		public DbSet<EquipmentMovementHistory> EquipmentMovementHistories { get; set; }
		
		public DbSet<ConditionParameterType> ConditionParameterTypes { get; set; }
		
		public DbSet<ConditionParameter> ConditionParameters { get; set; }
		
		public DbSet<ConditionParameterValue> ConditionParameterValues { get; set; }
		
		public DbSet<ConditionParameterValueRange> ConditionParameterValueRanges { get; set; }
		
		public DbSet<EquipmentFailureReason> EquipmentFailureReasons { get; set; }
		
		public DbSet<EquipmentFailureType> EquipmentFailureTypes { get; set; }
		
		public DbSet<ConditionParameterToModelLink> ConditionParameterToModelLinks { get; set; }
		
		public DbSet<ConditionParameterAdditionalData> ConditionParameterAdditionalData { get; set; }

		//public DbSet<DownTime> DownTimes { get; set; }


		//protected override void OnModelCreating(ModelBuilder modelBuilder)
		// Todo заменить на отдельные правила
		private void onModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.HasDiscriminator<string>("Code")
				.HasValue<WorkRequestCategory>("RZCAT")
				.HasValue<WorkRequestDirection>("RZNPR")
				.HasValue<WorkRequestRepairType>("RVR")
				.HasValue<TechnicalPlaceLevel>("RFSL")
				.HasValue<EquipmentStatus>("ROS")
				.HasValue<EquipmentCategory>("ROV")
				.HasValue<EquipmentFailureReason>("RFP")
				.HasValue<EquipmentFailureType>("RPD");

			modelBuilder.Entity<WorkRequest>()
				.HasOne(p => p.Category)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestCategoryId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(p => p.Direction)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestDirectionId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(p => p.RepairType)
				.WithMany(p => p.WorkRequests)
				.HasForeignKey(p => p.WorkRequestRepairTypeId)
				.HasPrincipalKey(p => p.Id);

			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.WorkRequestCategoryId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.WorkRequestDirectionId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.WorkRequestRepairTypeId)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.Source)
				.HasConversion(new WorkRequestSourceConverter());
			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.Status)
				.HasConversion(new WorkRequestStatusConverter());
			modelBuilder.Entity<WorkRequest>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());

			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.DeclarerEmployee)
				.WithMany()
//				.WithMany(e => e.DeclarerWorkRequests)
				.HasForeignKey(w => w.DeclarerEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.ResponsibleEmployee)
				.WithMany()
//				.WithMany(e => e.ResponcibleWorkRequests)
				.HasForeignKey(w => w.ResponsibleEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.PerformerEmployee)
				.WithMany()
//				.WithMany(e => e.PerformerWorkRequests)
				.HasForeignKey(w => w.PerformerEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.Equipment)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.EquipmentId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.TechnicalPlaceId);
			//modelBuilder.Entity<WorkRequest>()
			//	.HasOne(c => c.EquipmentModel)
			//	.WithMany(e => e.WorkRequests)
			//	.HasForeignKey(w => w.EquipmentModelId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.ItObject)
				.WithMany()
//				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.ItObjectId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.Department)
				.WithMany()
//				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.DepartmentId);

			//modelBuilder.Entity<TechnicalPlace>()
			//	.HasOne(c => c.Model)
			//	.WithMany(e => e.TechnicalPlaces)
			//	.HasForeignKey(w => w.ModelId);
			modelBuilder.Entity<TechnicalPlace>()
				.HasOne(c => c.Status)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.StatusId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<TechnicalPlace>()
				.HasOne(c => c.Category)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.CategoryId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<TechnicalPlace>()
				.HasOne(c => c.Level)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.LevelId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<TechnicalPlace>()
				.HasOne(c => c.ItObject)
				.WithMany()
//				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.ItObjectId);
			modelBuilder.Entity<TechnicalPlace>()
				.Property(w => w.IsProductionLosses)
				.HasConversion(v => (short) (v ? 1 : 0), v => v == 1);
			modelBuilder.Entity<TechnicalPlace>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());

			//modelBuilder.Entity<Equipment>()
			//	.HasOne(c => c.Model)
			//	.WithMany(e => e.Equipments)
			//	.HasForeignKey(w => w.ModelId);
			modelBuilder.Entity<Equipment>()
				.HasOne(c => c.Status)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.StatusId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<Equipment>()
				.HasOne(c => c.Category)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.CategoryId)
				.HasPrincipalKey(p => p.Id);
			modelBuilder.Entity<Equipment>()
				.HasOne(c => c.Type)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.TypeId);
			modelBuilder.Entity<Equipment>()
				.HasOne(c => c.ItObject)
				.WithMany()
//				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.ItObjectId);

			modelBuilder.Entity<EquipmentMovementHistory>()
				.HasOne(c => c.Equipment)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.EquipmentId);
			modelBuilder.Entity<EquipmentMovementHistory>()
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.TechnicalPlaceId);

			//modelBuilder.Entity<EquipmentModel>()
			//	.HasOne(c => c.ResourceGroup)
			//	.WithMany()
			//	.HasForeignKey(w => w.ResourceGroupId);

			//modelBuilder.Entity<EquipmentType>()
			//	.HasOne(c => c.ModelGroup)
			//	.WithOne(e => e.EquipmentType);

			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.AdditionalData)
				.WithOne(a => a.ConditionParameterValue)
				.HasForeignKey<ConditionParameterAdditionalData>(c => c.Id);

			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.Equipment)
				.WithMany()
				.HasForeignKey(c => c.EquipmentId);
			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.TechnicalPlace)
				.WithMany()
				.HasForeignKey(c => c.TechnicalPlaceId);
			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.EquipmentModel)
				.WithMany()
				.HasForeignKey(c => c.EquipmentModelId);
			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.Department)
				.WithMany()
				.HasForeignKey(c => c.DepartmentId);
			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.ConditionParameter)
				.WithMany()
				.HasForeignKey(c => c.ConditionParameterId);
			modelBuilder.Entity<ConditionParameterValue>()
				.HasOne(c => c.MeasurementUnit)
				.WithMany()
				.HasForeignKey(c => c.MeasurementUnitId);
			
			modelBuilder.Entity<ConditionParameter>()
				.HasOne(c => c.ConditionParameterType)
				.WithMany(t => t.ConditionParameters)
				.HasForeignKey(c => c.ConditionParameterTypeId);
			modelBuilder.Entity<ConditionParameter>()
				.HasOne(c => c.MeasurementUnit)
				.WithMany()
				.HasForeignKey(c => c.MeasurementUnitId);
			modelBuilder.Entity<ConditionParameterToModelLink>()
				.HasOne(c => c.ConditionParameter)
				.WithMany(c => c.ModelLinks)
				.HasForeignKey(c => c.ConditionParameterId);
			//modelBuilder.Entity<ConditionParameterToModelLink>()
			//	.HasOne(c => c.EquipmentModel)
			//	.WithMany(c => c.ConditionParameterLinks)
			//	.HasForeignKey(c => c.EquipmentModelId);
			modelBuilder.Entity<ConditionParameter>()
				.HasMany(c => c.ValueRanges)
				.WithOne(t => t.ConditionParameter)
				.HasForeignKey(c => c.ConditionParameterId);
			modelBuilder.Entity<ConditionParameter>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
			
			modelBuilder.Entity<ConditionParameterType>()
				.HasOne(c => c.WorkRequestDirection)
				.WithMany(t => t.ConditionParameterTypes)
				.HasForeignKey(c => c.WorkRequestDirectionId)
				.HasPrincipalKey(w => w.Id);
			modelBuilder.Entity<ConditionParameterType>()
				.Property(w => w.ParameterGroup)
				.HasConversion(new ConditionParameterGroupConverter());
			
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.Property(w => w.IsEmergency)
				.HasConversion(new DownTimeIsEmergencyConverter());
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.Property(w => w.IsPlanned)
				.HasConversion(new DownTimeIsPlannedConverter());
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.HasOne(c => c.FailureReason)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.FailureReasonId)
				.HasPrincipalKey(w => w.Id);
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.HasOne(c => c.FailureType)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.FailureTypeId)
				.HasPrincipalKey(w => w.Id);
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.HasOne(c => c.Direction)
				.WithMany(t => t.ConditionParameterAdditionalData)
				.HasForeignKey(c => c.DirectionId)
				.HasPrincipalKey(w => w.Id);
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.HasOne(c => c.SourceTechPlace)
				.WithMany()
				.HasForeignKey(c => c.SourceTechPlaceId);
			modelBuilder.Entity<ConditionParameterAdditionalData>()
				.HasOne(c => c.Responsible)
				.WithMany()
				.HasForeignKey(c => c.ResponsibleId);
			
			modelBuilder.Entity<ConditionParameterToModelLink>()
				.HasKey(c => new {c.ConditionParameterId, c.EquipmentModelId});
			
			modelBuilder.Entity<ConditionParameterValueRange>()
				.HasKey(c => new {c.ConditionParameterId, c.Id});
			modelBuilder.Entity<ConditionParameterValueRange>()
				.HasOne(c => c.Category)
				.WithMany()
				.HasForeignKey(c => c.WorkRequestCategoryId)
				.HasPrincipalKey(w => w.Id);
		}
		
//		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//		{
//			base.OnConfiguring(optionsBuilder);
//			optionsBuilder.UseSqlServer(@"Data Source=SQL03\SQL2008R2EE;Initial Catalog=EAM;User ID=sa; Password=lkmo");
//			optionsBuilder.UseSqlServer(@"Data Source=sql2016\SQL2016EE;Initial Catalog=SmartEAM;User ID=sa; Password=lkmo");
//		}

		// https://github.com/SimonCropp/GraphQL.EntityFramework/blob/master/doco/configuration.md

/*
		public EamDbContext(DbContextOptions<EamDbContext> options) :
			base(options)
		{
		}
		*/
	}
}
