using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI] 
	public class SmartManagerFoldersQuery : ObjectGraphType<object>
   {
	  public SmartManagerFoldersQuery(SmFoldersProvider provider)
		{
			Name = "Query";
			//получение папок
			Field<ListGraphType<SmartManagerFolders>>("Folders",
				resolve: (context => provider.getFoldersAsync()),
				description: "Папки");
		}
	}
}
