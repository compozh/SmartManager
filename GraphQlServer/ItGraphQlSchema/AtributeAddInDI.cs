using System;
using System.Collections.Generic;
using System.Security.Cryptography;
using System.Text;

namespace ItGraphQlSchema
{
	public class AtributeAddInDI : System.Attribute { }


	public class AttributeGraphQlField : System.Attribute
	{
		public string Description { get; set; }
	}
}
