using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.Model;

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
