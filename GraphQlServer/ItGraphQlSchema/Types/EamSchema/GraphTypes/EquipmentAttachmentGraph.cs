using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common;
using ItGraphQlSchema.Types.Common.Data;

namespace ItGraphQlSchema.Types.EamSchema
{
	[AddInDIAttribute, GraphType(typeof(EquipmentAttachment))]
	public class EquipmentAttachmentGraph: AttachmentGraph<EamDbContext, EquipmentAttachment>
	{
		public EquipmentAttachmentGraph(IEfGraphQLService<EamDbContext> graphQlService, IAttachmentsProvider attachmentsProvider) :
			base(graphQlService, attachmentsProvider)
		{
			Field(x => x.Key).Description("Значение ключа");
			Field(x => x.EquipmentId).Description("Код оборудования");
		}
	}
}