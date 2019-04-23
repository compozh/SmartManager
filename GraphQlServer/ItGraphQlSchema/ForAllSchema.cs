using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;
using GraphQL;
using GraphQL.Types;
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
			//Добавляем все типы в DI, которые ест ьв сборке и наследуются от IItAddInSingleton
			foreach (Type type in Assembly.GetCallingAssembly().GetTypes())
			{
				if (type.GetInterface("IItAddInSingleton") != null)
				{
					services.AddSingleton(type);
				}
			}
		}
	}
}
