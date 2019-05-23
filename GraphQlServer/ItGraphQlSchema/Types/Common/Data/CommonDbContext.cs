using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Reflection;

namespace ItGraphQlSchema.Types
{
	public sealed partial class CommonDbContext : DbContext
	{
		public DbSet<Employee> Employees { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<ItObject> ItObjects { get; set; }
		public DbSet<SimpleDictionaryRecord> SimpleDictionaryRecords { get; set; }
		public DbSet<MeasurementUnit> MeasurementUnits { get; set; }
		public DbSet<Resource> Resources { get; set; }
		public DbSet<ResourceGroup> ResourcesGroups { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			//Добавляем всех правил/связей и т.д. по атрибуту [EFRule] (интерфейс IEFRulesBase)
			foreach (Type type in Assembly.GetExecutingAssembly().GetTypes()) //GetCallingAssembly
			{
				if (type.GetCustomAttribute<EFRuleAttribute>(true) != null)
				{
					IEFRulesBase ruleInstance = (IEFRulesBase)Activator.CreateInstance(type);
					ruleInstance.AddRulesToModel(modelBuilder);
				}
			}

			//todo  Убрать после переноса логика EAM
			eamOnModelCreating(modelBuilder);
			testOnModelCreating(modelBuilder);
		}

		// https://github.com/SimonCropp/GraphQL.EntityFramework/blob/master/doco/configuration.md
		static CommonDbContext()
		{
			var builder = new DbContextOptionsBuilder();
			builder.UseSqlServer(@"fake");

			//using (var context = new CommonDbContext(builder.Options))
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

