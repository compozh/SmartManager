using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.Common.Data;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(ResourceAttachment))]
	public class ResourceAttachmentGraph: AttachmentGraph<EamDbContext, ResourceAttachment>
	{
		public ResourceAttachmentGraph(IEfGraphQLService<EamDbContext> graphQlService, IAttachmentsProvider attachmentsProvider) :
			base(graphQlService, attachmentsProvider)
		{
			Field(x => x.Key).Description("Значение ключа");
			Field(x => x.ResourceId).Description("Код ресурса");
		}
	}
}