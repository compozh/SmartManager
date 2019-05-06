using GraphQL.Types;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	class SmartManagerTasksQuery : ObjectGraphType<object>
	{
		public SmartManagerTasksQuery(SmTasksProvider provider)
		{
		
			Name = "Query";
			//получение папок
			Field<ListGraphType<SmartManagerTasks>>("Tasks",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> {Name = "folderId", Description = "Уникальный идентификатор задачи" }),
				resolve: (context => provider.GetTasksAsync(context.GetArgument<string>("folderId"))),
				description: "Задачи");

			Field<SmartManagerTasksGetInfo>("TasksGetInfo",
				arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "taskId", Description = "Уникальный идентификатор задачи" }),
				resolve: (context => provider.GetTasksInfoAsync(context.GetArgument<int>("taskId"))),
				description: "Задачи");
		}
	}
}

