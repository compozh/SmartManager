using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class DocumentRowEFRule : EFRulesBase<DocumentRow>
	{
		public override void AddRuleToModel(EntityTypeBuilder<DocumentRow> entity)
		{
			entity.HasKey(c => new { c.DocumentId, c.Id });
		}
	}
}
