using System;
using System.Collections.Generic;
using GraphQL;
using GraphQL.Resolvers;
using GraphQL.Types;
using Microsoft.Extensions.DependencyInjection;
using Web.Data;
using System.Linq;

namespace SkdScheme.CommonSchema
{
	public class CommonSchema : Schema
	{
		public CommonSchema(IDependencyResolver dependencyResolver, string schemaName) : base(dependencyResolver)
		{
			var schemaTools = dependencyResolver.Resolve<SchemaTools>();
			var schemaDescription = schemaTools.GetSchemaDescription(schemaName);

			var root = new ObjectGraphType
			{
				Name = "QueryRoot"
			};
			Query = root;
			foreach (var type in schemaDescription.Types)
			{
				var commonType = new ObjectGraphType
				{
					Name = type.Id,
					Description = type.Name
					
				};

				foreach (var col in type.Columns)
				{
					commonType.DictionaryField(typeSelection(col.Type), col.Name.ToLower(), col.Description);
				}

				root.Field(type.Id, new ListGraphType(commonType), type.Name, resolve: ctx => {
						return schemaTools.GetDataForType(type, ctx.SubFields.Keys.ToList());
					}
				);
				
				RegisterTypes(commonType);
			}
		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<SchemaTools>();
		}
		private IGraphType typeSelection(SlvColumnType type)
		{
			switch (type)
			{
				case SlvColumnType.Char:
					return new StringGraphType();
					break;
				case SlvColumnType.Date:
					return new DateGraphType();
					break;
				case SlvColumnType.Guid:
					return new GuidGraphType();
					break;
				case SlvColumnType.Memo:
					return new StringGraphType();
					break;
				case SlvColumnType.Numeric:
					return new IntGraphType();
					break;
				case SlvColumnType.DateTime:
					return new DateTimeGraphType();
					break;
				default:
					return new StringGraphType();
					break;
			}
		}
	}
}
