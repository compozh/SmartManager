using System.Collections.Generic;
using GraphQL.Types;
using Newtonsoft.Json;

namespace ItGraphQlSchema.Types.LMS.Model
{
	[AddInDI]
	public class AvailableFilters : ObjectGraphType<AvailableFilters>
	{
		public List<FilterProperty> Roles { get; set; }
		[JsonProperty("levels")]
		public List<FilterProperty> Levels { get; set; }
		[JsonProperty("products")]
		public List<FilterProperty> Products { get; set; }
		[JsonProperty("tags")]
		public List<FilterProperty> Tags { get; set; }

		public Course Course { get; set; }

		public AvailableFilters()
		{
			Name = "availableFilters";

			Field<ListGraphType<FilterProperty>>("roles", resolve: context => context.Source.Roles);
			Field<ListGraphType<FilterProperty>>("levels", resolve: context => context.Source.Levels);
			Field<ListGraphType<FilterProperty>>("products", resolve: context => context.Source.Products);
			Field<ListGraphType<FilterProperty>>("tags", resolve: context => context.Source.Tags);
		}
	}
}
