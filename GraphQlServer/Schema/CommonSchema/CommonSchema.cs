using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using Web.Data;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

namespace SkdScheme.CommonSchema
{
	public class CommonSchema : Schema
	{
		public CommonSchema(IDependencyResolver dependencyResolver, string schemaName, bool anonymousСall) : base(dependencyResolver)
		{
			var root = new ObjectGraphType
			{
				Name = "QueryRoot"
			};
			Query = root;

			var schemaTools = dependencyResolver.Resolve<SchemaTools>();
			var cache = dependencyResolver.Resolve<IMemoryCache>();
			//Выбираем из Local Storage схему
			var schemaDescription = cache.Get<SchemaDescription>(schemaName);
			//Проверяем, схему, если нашли в хранилище, то ок
			if (schemaDescription == null)
			{
				schemaDescription = schemaTools.GetSchemaDescription(schemaName, anonymousСall);
				if (schemaDescription != null)
				{
					cache.Set<SchemaDescription>(schemaName, (SchemaDescription)schemaDescription);
				}
			}
			//Проверка на то, что запрашиваем схему анонимно, но она не доступна для анонимного вызова.
			if (anonymousСall && schemaDescription.AllowAnonymosly != "+")
			{
				return;
			}

			foreach (var type in schemaDescription.Types)
			{
				var commonType = new ObjectGraphType
				{
					Name = type.Id,
					Description = type.Name,
				};
				foreach (var col in type.Columns)
				{
					//Наполнение типа полями
					commonType.DictionaryField(typeSelection(col.Type), col.Name.ToLower(), col.Description);
				}
				//Выборка доступных типов для анонимного запроса
				if (type.AllowAnonymosly == "+" || !anonymousСall)
				{
					//Наполнение схемы типами
					root.Field(type.Id, new ListGraphType(commonType), type.Name, resolve: ctx => {
							return dependencyResolver.Resolve<SchemaTools>().GetDataForType(type, ctx.SubFields.Keys.ToList());
						}
					);
				}
				RegisterTypes(commonType);
			}
		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<SchemaTools>();
		}
		/// <summary>
		/// Преобразование типа колонки к типу данных GraphQl
		/// </summary>
		/// <param name="type">Тип колонки</param>
		/// <returns></returns>
		private IGraphType typeSelection(SlvColumnType type)
		{
			switch (type)
			{
				case SlvColumnType.Char:
					return new StringGraphType();
				case SlvColumnType.Date:
					return new DateGraphType();
				case SlvColumnType.Guid:
					return new GuidGraphType();
				case SlvColumnType.Memo:
					return new StringGraphType();
				case SlvColumnType.Numeric:
					return new IntGraphType();
				case SlvColumnType.DateTime:
					return new DateTimeGraphType();
				case SlvColumnType.Decimal:
					return new DecimalGraphType();
				default:
					return new StringGraphType();
			}
		}
	}
}
