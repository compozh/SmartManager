using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.Common.Data;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDI, GraphType(typeof(WorkRequestAttachment))]
	public class WorkRequestAttachmentGraph: AttachmentGraph<EamDbContext, WorkRequestAttachment>
	{
		public WorkRequestAttachmentGraph(IEfGraphQLService<EamDbContext> graphQlService, IAttachmentsProvider attachmentsProvider) :
			base(graphQlService, attachmentsProvider)
		{
			Field(x => x.Key).Description("Значение ключа");
			Field(x => x.WorkRequestId).Description("Код заявки");
		}
	}
}