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

	// TODO Сделать возсожность декларативно создавать простые FK
	public class GraphTypeFKAttribute : Attribute
	{
		public Type RelatedType { get; }

		public string NavigationFromName { get; }

		public RelationType RelationType { get; }

		public string[] ForignKeyNames { get; }

		public string[] PrincipalKeyNames { get; set; }

		private GraphTypeFKAttribute(Type relatedType, string navigationFromName, string[] fkFromNames, RelationType relationType)
		{
			RelatedType = relatedType;
			NavigationFromName = navigationFromName;
			RelationType = relationType;
			ForignKeyNames = fkFromNames;
		}
		/// <summary>
		/// Many to one
		/// </summary>
		/// <param name="relatedTypeName"></param>
		/// <param name="relatedTypeNameFrom"></param>
		public GraphTypeFKAttribute(Type relatedType, string navigationFromName, string [] fkFromNames) 
			: this(relatedType, navigationFromName, fkFromNames, RelationType.ManyToOne)
		{

		}

		/// <summary>
		/// One to many
		/// </summary>
		/// <param name="relatedTypeName"></param>
		public GraphTypeFKAttribute(string[] fkFromFieldNames) 
			: this(null, string.Empty, fkFromFieldNames, RelationType.OneToMany)
		{
		}
	}

	public enum RelationType
	{
		OneToMany,
		ManyToOne
	}
}
