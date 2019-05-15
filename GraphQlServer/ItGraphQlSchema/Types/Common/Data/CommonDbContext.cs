using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace ItGraphQlSchema.Types.Common
{
	public class CommonDbContext : DbContext
	{
		public DbSet<Employee> Employees { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<ItObject> ItObjects { get; set; }
		public DbSet<SimpleDictionaryRecord> SimpleDictionaryRecords { get; set; }
		public DbSet<MeasurementUnit> MeasurementUnits { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.Property(w => w.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
			modelBuilder.Entity<SimpleDictionaryRecord>()
				.HasKey(s => new {s.Id, s.NumericId, s.Code});

			modelBuilder.Entity<Employee>()
				.HasOne(c => c.ItObject)
				.WithMany(o => o.Employees)
				.HasForeignKey(c => c.ItObjectId);
			
			modelBuilder.Entity<MeasurementUnit>()
				.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());
			
			modelBuilder.Entity<Employee>()
				.HasOne(c => c.ItObject)
				.WithMany(o => o.Employees)
				.HasForeignKey(c => c.ItObjectId);
		}

		// https://github.com/SimonCropp/GraphQL.EntityFramework/blob/master/doco/configuration.md
		static CommonDbContext()
		{
			var builder = new DbContextOptionsBuilder();
			builder.UseSqlServer(@"fake");

			using (var context = new CommonDbContext(builder.Options))
			{
				DataModel = context.Model;
			}
		}

		public CommonDbContext(DbContextOptions options) :
			base(options)
		{
		}

		public static IModel DataModel { get; }
	}
}
