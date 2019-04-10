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

			foreach (var type in schemaDescription.Types)
			{
				var commonType = new ObjectGraphType
				{
					Name = schemaDescription.Id
				};

				foreach (var col in type.Columns)
				{
					commonType.DictionaryField(new StringGraphType(), col.Name.ToLower(), col.Description);

				}

				var root = new ObjectGraphType
				{
					Name = "QueryRoot"
				};

				root.Field(schemaDescription.Id, new ListGraphType(commonType), resolve: ctx => {
						return schemaTools.GetDataForQueriedColumns(schemaDescription, ctx.SubFields.Keys.ToList());
					}
				);
				Query = root;
				RegisterTypes(commonType);
			}
		}

		public static void Config(IServiceCollection services)
		{
			services.AddSingleton<SchemaTools>();
		}
	}
}
