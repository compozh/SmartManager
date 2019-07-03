using GraphQL.EntityFramework;
using System;
using System.Collections.Generic;
using System.Text;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDI, GraphType(typeof(Document))]
	public class DocumentGraph : EfObjectGraphType<CommonDbContext, Document>
	{
		public DocumentGraph(IEfGraphQLService<CommonDbContext> graphQlService) : base(graphQlService)
		{
			Name = "document";
			Field(p => p.Id).Description("Идентификатор документа");
			Field(p => p.Number).Description("Номер");
			Field(p => p.Date, nullable: true).Description("Дата");
			Field(p => p.Title, nullable: true).Description("Наименование");
			Field(p => p.DocumentTypeId).Description("Код типа документа");
			Field(p => p.SenderDepartmentId, nullable: true).Description("Подразделение отправитель, уникальный номер");
			AddNavigationField(
				name: "senderDepartment",
				resolve: context => context.Source.SenderDepartment);
			Field(p => p.ReceiverDepartmentId, nullable: true).Description("Подразделение получатель, уникальный номер");
			AddNavigationField(
				name: "seceiverDepartment",
				resolve: context => context.Source.ReceiverDepartment);
			Field(p => p.SenderResponsibleId, nullable: true).Description("Ответственный отправитель, код");
			AddNavigationField(
				name: "senderResponsible",
				resolve: context => context.Source.SenderResponsible);
			Field(p => p.ReceiverResponsibleId, nullable: true).Description("Ответственный получатель, код");
			AddNavigationField(
				name: "receiverResponsible",
				resolve: context => context.Source.ReceiverResponsible);
			Field(p => p.MaterialResponsibleId, nullable: true).Description("Материально-ответственный, код");
			AddNavigationField(
				name: "materialResponsible",
				resolve: context => context.Source.MaterialResponsible);
			AddNavigationListField(
				name: "rows",
				resolve: context => context.Source.Rows).Description = "Строки документа";
		}
	}
}
