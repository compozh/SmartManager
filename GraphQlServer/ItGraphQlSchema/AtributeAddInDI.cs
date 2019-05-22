using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace ItGraphQlSchema
{
	public class AddInDIAttribute : Attribute
	{
		public Type ImplementedType { get; }

		public AddInDIAttribute(Type implementedType = null)
		{
			ImplementedType = implementedType;
		}
	}

	public class AttributeGraphQlField : Attribute
	{
		public string Description { get; set; }
	}

	public class EFRuleAttribute : Attribute
	{

	}

	public class GraphTypeAttribute : Attribute
	{
		public Type ImplementedType { get; }

		public GraphTypeAttribute(Type implementedType)
		{
			ImplementedType = implementedType;
		}
	}
}
