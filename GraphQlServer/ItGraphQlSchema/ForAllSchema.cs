using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using GraphQL;
using GraphQL.Types;
using GraphQL.Utilities;
using ItGraphQlSchema.Types;
using Microsoft.Extensions.DependencyInjection;

namespace ItGraphQlSchema
{
	class ForAllSchemas : Schema
	{
		public ForAllSchemas(IDependencyResolver dependencyResolver) : base(dependencyResolver)
		{
		}
		public static void Config(IServiceCollection services)
		{
			//foreach (Type type in Assembly.GetExecutingAssembly().GetTypes()) //GetCallingAssembly
			//{
			//}
			//Добавляем все типы в DI, которые помечены атрибутом [AtributeAddInDI]
			foreach (Type type in Assembly.GetCallingAssembly().GetTypes())
			{
				AddInDIAttribute addInDIAtribute;
				if ((addInDIAtribute = type.GetCustomAttribute<AddInDIAttribute>()) != null)
				{
					if (addInDIAtribute.ImplementedType == null)
					{
						services.AddSingleton(type);
					}
					else
					{
						services.AddSingleton(addInDIAtribute.ImplementedType, type);
					}
				}
				GraphTypeAttribute graphTypeAttribute;
				if ((graphTypeAttribute = type.GetCustomAttribute<GraphTypeAttribute>()) != null)
				{
					GraphTypeTypeRegistry.Register(graphTypeAttribute.ImplementedType, type);
				}
			}
		}
	}
}
