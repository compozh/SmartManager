using GraphQL.EntityFramework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.Common.GraphTypes
{
	[AddInDI, GraphType(typeof(DocumentRow))]
	class DocumentRowGraph : EfObjectGraphType<DocumentRow>
	{
		public DocumentRowGraph(IEfGraphQLService graphQlService) : base(graphQlService)
		{
			Name = "docuemtRow";
			Field(x => x.DocumentId).Description("Идентификатор документа");
			AddNavigationField(
				name: "document",
				resolve: context => context.Source.Document);
			Field(x => x.Id).Description("Идентификатор строки документа");
			Field(x => x.ResourceId, nullable: true).Description("Идентификатор материала");
			AddNavigationField(
				name: "resource",
				resolve: context => context.Source.Resource);
			Field(x => x.MeasurementUnitId, nullable: true).Description("Кд ЕИ");
			AddNavigationField(
				name: "measurementUnit",
				resolve: context => context.Source.MeasurementUnit);
		}
	}
}
