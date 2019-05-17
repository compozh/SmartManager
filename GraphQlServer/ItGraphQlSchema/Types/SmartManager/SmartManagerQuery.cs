using GraphQL.Types;
using ItGraphQlSchema.Types.SmartManager.GraphQlModel;

namespace ItGraphQlSchema.Types.SmartManager
{
	[AtributeAddInDI]
	class SmartManagerQuery : ObjectGraphType<object>
	{
		public SmartManagerQuery(SmartManagerProvider provider)
		{
		Name = "Query";
		
			// Получение папок
			Field<ListGraphType<SmartManagerTaskGQ>>("Tasks",
				arguments: new QueryArguments(new QueryArgument<StringGraphType> {Name = "folderId", Description = "Уникальный идентификатор задачи" }),
				resolve: (context => provider.GetTasksAsync(context.GetArgument<string>("folderId"))),
				description: "Задачи");
			
			// Получение Подробной информации задачи
			Field<SmartManagerTaskFullInfoGQ>("TasksGetInfo",
				arguments: new QueryArguments(new QueryArgument<IntGraphType> { Name = "taskId", Description = "Уникальный идентификатор задачи" }),
				resolve: (context => provider.GetTasksInfoAsync(context.GetArgument<int>("taskId"))),
				description: "Задачи");
			
			// Получение папок
			Field<ListGraphType<SmartManagerFoldersGQ>>("Folders",
				resolve: (context => provider.GetFoldersAsync()),
				description: "Папки");
		}
	}
}

