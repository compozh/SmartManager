using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ItGraphQlSchema.Types.SmartManager
{
   public class SmartManagerFoldersQuery : ObjectGraphType<object>, IItAddInSingleton
   {
	  public SmartManagerFoldersQuery(SmFoldersProvider provider)
		{
			Name = "Query";
			Field<ListGraphType<SmartManagerFolders>>("Folders",
				resolve: (context => provider.getFoldersAsync()),
				description: "Папки");
		}
	}
}
