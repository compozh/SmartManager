using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System.Linq;

namespace ItGraphQlSchema.Types
{
	public interface IEFRulesBase
	{
		void AddRulesToModel(ModelBuilder modelBuilder);
	}

	public abstract class EFRulesBase<T> : IEFRulesBase where T : class
	{
		public void AddRulesToModel(ModelBuilder modelBuilder)
		{
			var type = typeof(T);
			GraphTypeFKAttribute graphTypeAttribute;
			var entityBuilder = modelBuilder.Entity<T>();
			foreach (var prop in type.GetProperties())
			{
				var attr = prop.GetCustomAttributes(typeof(GraphTypeFKAttribute), true);
				if (!attr.Any())
				{
					continue;
				}
				graphTypeAttribute = attr.Cast<GraphTypeFKAttribute>().First();
				switch (graphTypeAttribute.RelationType)
				{
					case RelationType.OneToMany:
						var referenceCollectionBuilder = entityBuilder
													.HasOne(prop.PropertyType, prop.Name)
													.WithMany()
													.HasForeignKey(graphTypeAttribute.ForignKeyNames);
						if (graphTypeAttribute.PrincipalKeyNames != null && graphTypeAttribute.PrincipalKeyNames.Any())
						{
							referenceCollectionBuilder.HasPrincipalKey(graphTypeAttribute.PrincipalKeyNames);
						}
						break;
					case RelationType.ManyToOne:
						referenceCollectionBuilder = entityBuilder
							.HasMany(graphTypeAttribute.RelatedType, prop.Name)
							.WithOne(graphTypeAttribute.NavigationFromName)
							.HasForeignKey(graphTypeAttribute.ForignKeyNames);
						if (graphTypeAttribute.PrincipalKeyNames != null && graphTypeAttribute.PrincipalKeyNames.Any())
						{
							referenceCollectionBuilder.HasPrincipalKey(graphTypeAttribute.PrincipalKeyNames);
						}
						break;
				}
			}
			AddRuleToModel(entityBuilder);
		}

		public virtual void AddRuleToModel(EntityTypeBuilder<T> entity) { }

	}
}