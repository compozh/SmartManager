using GraphQL.EntityFramework;

namespace ItGraphQlSchema.Types.EamSchema
{
	public class TechnicalPlaceLevelGraph : EfObjectGraphType<TechnicalPlaceLevel>, IItAddInSingleton
	{
		public TechnicalPlaceLevelGraph(IEfGraphQLService graphQlService) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Id");
			Field(x => x.Name);
			Field(x => x.ShortName);
			AddNavigationListField(
				name: "technicalPlaces",
				resolve: context => context.Source.TechnicalPlaces);
			AddNavigationConnectionField(
				name: "technicalPlacesConnection",
				resolve: context => context.Source.TechnicalPlaces,
				includeNames: new[] {"TechnicalPlaces"});
		}
	}
}