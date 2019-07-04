using ItGraphQlSchema.Types.Common;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Reflection;
using ItGraphQlSchema.Types.EamSchema;

namespace ItGraphQlSchema.Types
{
	public partial class CommonDbContext : DbContext
	{
		public DbSet<Employee> Employees { get; set; }
		public DbSet<Department> Departments { get; set; }
		public DbSet<ItObject> ItObjects { get; set; }
		public DbSet<MeasurementUnit> MeasurementUnits { get; set; }
		public DbSet<Resource> Resources { get; set; }
		public DbSet<ResourceGroup> ResourcesGroups { get; set; }
		public DbSet<Document> Documents { get; set; }
		public DbSet<DocumentRow> DocumentRows { get; set; }
		public DbSet<Image> Images { get; set; }
		public DbSet<ResourceAttachment> ResourceAttachments { get; set; }

		protected override void OnModelCreating(ModelBuilder modelBuilder)
		{
			base.OnModelCreating(modelBuilder);
			
			//Добавляем всех правил/связей и т.д. по атрибуту [EFRule] (интерфейс IEFRulesBase)
			foreach (var type in Assembly.GetExecutingAssembly().GetTypes()) //GetCallingAssembly
			{
				var efRuleAttribute = type.GetCustomAttribute<EFRuleAttribute>(true);
				if ( efRuleAttribute != null)
					//if ( efRuleAttribute != null)
				{
					var ruleInstance = (IEFRulesBase)Activator.CreateInstance(type);
					ruleInstance.AddRulesToModel(modelBuilder);
				}
			}
			
			//todo  Убрать после переноса логики
			testOnModelCreating(modelBuilder);
		}

		public CommonDbContext(DbContextOptions<CommonDbContext> options) : 
			base(options) 
		{
		}
		
		protected CommonDbContext(DbContextOptions options) : 
			base(options) 
		{
		}
	}
}

