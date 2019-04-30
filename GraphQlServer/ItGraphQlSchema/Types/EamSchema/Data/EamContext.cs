using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class EamContext : DbContext
	{
		public DbSet<WorkRequest> WorkRequests { get; set; }
		public DbSet<WorkRequestCategory> WorkRequestCategories { get; set; }
		public DbSet<WorkRequestRepairType> WorkRequestRepairTypes { get; set; }
		public DbSet<WorkRequestDirection> WorkRequestDirections { get; set; }
		public DbSet<Employee> Employees { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<ItObject> ItObjects { get; set; }
		public DbSet<Equipment> Equipments { get; set; }
		public DbSet<TechnicalPlace> TechnicalPlaces { get; set; }
		public DbSet<EquipmentType> EquipmentTypes { get; set; }
		public DbSet<EquipmentModel> EquipmentModels { get; set; }
		public DbSet<EquipmentModelGroup> EquipmentModelGroups { get; set; }
		public DbSet<EquipmentStatus> EquipmentStatuses { get; set; }
		public DbSet<EquipmentCategory> EquipmentCategories { get; set; }
		public DbSet<TechnicalPlaceLevel> TechnicalPlaceLevels { get; set; }
		public DbSet<EquipmentMovementHistory> EquipmentMovementHistories { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.Property(w => w.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			modelBuilder.Entity<SimpleDictionaryRecord>().ToTable("SP2")
				.HasDiscriminator<string>("Code")
				.HasValue<WorkRequestCategory>("RZCAT")
				.HasValue<WorkRequestDirection>("RZNPR")
				.HasValue<WorkRequestRepairType>("RVR")
				.HasValue<TechnicalPlaceLevel>("RFSL")
				.HasValue<EquipmentStatus>("ROS")
				.HasValue<EquipmentCategory>("ROV");
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.HasKey(s => new {s.Id, s.NumericId, s.Code});

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
				.WithMany(e => e.DeclarerWorkRequests)
				.HasForeignKey(w => w.DeclarerEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.ResponsibleEmployee)
				.WithMany(e => e.ResponcibleWorkRequests)
				.HasForeignKey(w => w.ResponsibleEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.PerformerEmployee)
				.WithMany(e => e.PerformerWorkRequests)
				.HasForeignKey(w => w.PerformerEmployeeId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.Equipment)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.EquipmentId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.TechnicalPlaceId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.EquipmentModel)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.EquipmentModelId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.ItObject)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.EquipmentId);
			modelBuilder.Entity<WorkRequest>()
				.HasOne(c => c.Department)
				.WithMany(e => e.WorkRequests)
				.HasForeignKey(w => w.DepartmentId);

			modelBuilder.Entity<TechnicalPlace>()
				.HasOne(c => c.Model)
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.ModelId);
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
				.WithMany(e => e.TechnicalPlaces)
				.HasForeignKey(w => w.ItObjectId);
			modelBuilder.Entity<TechnicalPlace>()
				.Property(w => w.IsProductionLosses)
				.HasConversion(v => (short) (v ? 1 : 0), v => v == 1);
			modelBuilder.Entity<TechnicalPlace>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());

			modelBuilder.Entity<Equipment>()
				.HasOne(c => c.Model)
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.ModelId);
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
				.WithMany(e => e.Equipments)
				.HasForeignKey(w => w.ItObjectId);

			modelBuilder.Entity<EquipmentMovementHistory>()
				.HasOne(c => c.Equipment)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.EquipmentId);
			modelBuilder.Entity<EquipmentMovementHistory>()
				.HasOne(c => c.TechnicalPlace)
				.WithMany(e => e.MovementHistories)
				.HasForeignKey(w => w.TechnicalPlaceId);

			modelBuilder.Entity<EquipmentModel>()
				.HasOne(c => c.ModelGroup)
				.WithMany(e => e.EquipmentModels)
				.HasForeignKey(w => w.ModelGroupId);

			modelBuilder.Entity<EquipmentType>()
				.HasOne(c => c.ModelGroup)
				.WithOne(e => e.EquipmentType);

			modelBuilder.Entity<Employee>()
				.HasOne(c => c.ItObject)
				.WithMany(o => o.Employees)
				.HasForeignKey(c => c.ItObjectId);
		}

//		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
//		{
//			base.OnConfiguring(optionsBuilder);
//			optionsBuilder.UseSqlServer(@"Data Source=SQL03\SQL2008R2EE;Initial Catalog=EAM;User ID=sa; Password=lkmo");
//			optionsBuilder.UseSqlServer(@"Data Source=sql2016\SQL2016EE;Initial Catalog=SmartEAM;User ID=sa; Password=lkmo");
//		}

		// https://github.com/SimonCropp/GraphQL.EntityFramework/blob/master/doco/configuration.md
		static EamContext()
		{
			var builder = new DbContextOptionsBuilder();
			builder.UseSqlServer(@"fake");

			using (var context = new EamContext(builder.Options))
			{
				DataModel = context.Model;
			}
		}

		public EamContext(DbContextOptions options) :
			base(options)
		{
		}

		public static readonly IModel DataModel;
	}
}
