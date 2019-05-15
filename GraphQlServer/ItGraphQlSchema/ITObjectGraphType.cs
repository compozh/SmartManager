using System.Linq;
using GraphQL.Types;
using ItGraphQlSchema.CommonSchema;

namespace ItGraphQlSchema
{
	public class ITObjectGraphType<T>: ObjectGraphType<T>
	{
		public ITObjectGraphType()
		{
			var propertyInfos = GetType().GetProperties().Where(prop => prop.IsDefined(typeof(AttributeGraphQlField), false));

			foreach (var propertyInfo in propertyInfos)
			{
				
				
//				this.DictionaryField(typeSelection(col.Type), col.Name.ToLower(), col.Description);
				
			}
			
		}
	}
	
	 
}