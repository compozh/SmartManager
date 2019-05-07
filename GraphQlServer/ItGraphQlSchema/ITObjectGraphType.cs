using System.Linq;
using GraphQL.Types;
using ItGraphQlSchema.CommonSchema;

namespace ItGraphQlSchema
{
	public class ITObjectGraphType<T>: GraphQL.Annotations.Types.ObjectGraphType<T> where T : class
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