using System;
using GraphQL;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;
using Microsoft.Extensions.Caching.Memory;

namespace ItGraphQlSchema.CommonSchema
{
	public class CommonSchema : Schema
	{
		private IDependencyResolver _dependencyResolver;
		public CommonSchema(IDependencyResolver dependencyResolver, string schemaName, bool anonymousСall) : base(dependencyResolver)
		{
			_dependencyResolver = dependencyResolver;
		   var root = new ObjectGraphType
			{
				Name = "QueryRoot"
			};
			Query = root;
			Mutation = new ObjectGraphType {
				Name = "MutationRoot"
			};
			
			var schemaTools = _dependencyResolver.Resolve<SchemaTools>();
			var cache = _dependencyResolver.Resolve<IMemoryCache>();
			
			//Выбираем из Local Storage схему
			var schemaDescription = cache.Get<SchemaDescription>(schemaName);

			// ВРЕМЕННО
			schemaDescription = null;
			//Проверяем, схему, если нашли в хранилище, то ок

			if (schemaDescription == null)
			{
				schemaDescription = schemaTools.GetSchemaDescription(schemaName, anonymousСall);
				if (schemaDescription != null)
				{
					//Кешируем данные
					cache.Set<SchemaDescription>(schemaName, (SchemaDescription)schemaDescription);
				}
				else
				{
					return;
				}
			}
			//Проверка на то, что запрашиваем схему анонимно, но она не доступна для анонимного вызова.
			if (anonymousСall && schemaDescription.AllowAnonymosly != "+")
			{
				return;
			}

			foreach (var type in schemaDescription.Types)
			{
				//Проверка типа на анонимность
				if (type.AllowAnonymosly != "+"  && anonymousСall)
				{
					continue;
				}

				registerSchemaType(type, root, Mutation as ObjectGraphType);

			}
		}

		private void registerSchemaType(SchemaType type, ObjectGraphType root, ObjectGraphType mutation)
		{
			//Если такой тип в проекте уже уже есть 
			if (string.IsNullOrEmpty(type.BrowseId) && string.IsNullOrEmpty(type.TableName))
			{
				var assemblyType = Type.GetType("ItGraphQlSchema.Types." + type.Name);
				if (assemblyType != null)
				{
					var resolver = new object();
					root.Field(assemblyType, type.Id, type.Name, resolve: ctx => resolver);
				}
				assemblyType = Type.GetType("ItGraphQlSchema.Types." + type.Name+"Mutation");
				if (assemblyType != null)
				{
					var resolver = new object();
					mutation.Field(assemblyType, type.Id+"Mutation", type.Name+"Mutation", resolve: ctx => resolver);
				}
				
				return;
			}
			var commonType = new ObjectGraphType
			{
				Name = type.Id,
				Description = type.Name,
			};
			//Наполнение типа полями
			foreach (var col in type.Columns)
			{
				commonType.DictionaryField(typeSelection(col.Type), col.Name.ToLower(), col.Description);
			}
			//Наполнение схемы типами
			root.Field(type.Id, new ListGraphType(commonType), type.Name, resolve: ctx => {
					return _dependencyResolver.Resolve<SchemaTools>().GetDataForType(type, ctx.SubFields.Keys.ToList());
				}
			);
			RegisterTypes(commonType);
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
