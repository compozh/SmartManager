using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class SimpleDictionaryRecordEFRule : EFRulesBase<SimpleDictionaryRecord>
	{
		public override void AddRuleToModel(EntityTypeBuilder<SimpleDictionaryRecord> entity)
		{
			entity.Property(w => w.Id)
				.HasConversion(v => v.TrimEnd(), v => v.TrimEnd());

			entity.Property(w => w.IsValid)
				.HasConversion(new IsValidConverter());

			entity.HasKey(s => new { s.Id, s.NumericId, s.Code });
		}
	}
}
