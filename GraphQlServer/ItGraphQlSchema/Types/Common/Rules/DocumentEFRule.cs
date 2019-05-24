using System;
using System.Collections.Generic;
using System.Text;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace ItGraphQlSchema.Types.Common
{
	[EFRule]
	public class DocumentEFRule : EFRulesBase<Document>
	{
		public override void AddRuleToModel(EntityTypeBuilder<Document> entity)
		{

		}
	}
}
