using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

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
			AddRuleToModel(modelBuilder.Entity<T>());
		}

		public abstract void AddRuleToModel(EntityTypeBuilder<T> entity);

	}
}