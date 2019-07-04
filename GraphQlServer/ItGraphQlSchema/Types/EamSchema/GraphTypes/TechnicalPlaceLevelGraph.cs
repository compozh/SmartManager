using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(TechnicalPlaceLevel))]
	public class TechnicalPlaceLevelGraph : SimpleDictionaryRecordGraph<EamDbContext, TechnicalPlaceLevel>
	{
		public TechnicalPlaceLevelGraph(IEfGraphQLService<EamDbContext> graphQlService) :
			base(graphQlService)
		{
			AddNavigationListField(name: "technicalPlaces", resolve: context => context.Source.TechnicalPlaces);
			AddNavigationConnectionField(name: "technicalPlacesConnection",
				resolve: context => context.Source.TechnicalPlaces, includeNames: new[] {"TechnicalPlaces"});
		}
	}
}