using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;
using System.Threading.Tasks;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	public class SmartManagerFoldersGQ : ObjectGraphType<SmartManagerFolder>
	{
		public SmartManagerFoldersGQ(SmartManagerProvider provider)
		{
			Name = "Folders";

			Field(p => p.code).Description("Код папки");
			Field(p => p.name).Description("Наименование");
			Field(p => p.count).Description("Количество задач в папке");

		}
	}
}
