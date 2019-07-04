using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using GraphQL.EntityFramework;
using ItGraphQlSchema.Types.Common.Data;

namespace ItGraphQlSchema.Types.Common
{
	[AddInDIAttribute, GraphType(typeof(Attachment))]
	public class AttachmentGraph :AttachmentGraph<CommonDbContext, Attachment>
	{
		public AttachmentGraph(IEfGraphQLService<CommonDbContext> graphQlService, IAttachmentsProvider attachmentsProvider) : base(graphQlService, attachmentsProvider)
		{
		}
	}
	
	public class AttachmentGraph<TDbContext, T> : EfObjectGraphType<TDbContext, T>
		where T : Attachment where TDbContext : CommonDbContext
	{
		public AttachmentGraph(IEfGraphQLService<TDbContext> graphQlService, IAttachmentsProvider attachmentsProvider) :
			base(graphQlService)
		{
			Field(x => x.Id).Description("Код вложения");
			Field(x => x.Alias).Description("Алиас таблицы");
			Field(x => x.Number).Description("Номер");
			Field(x => x.FileName).Description("Имя файла");
			Field(x => x.FileSize).Description("Размер файла");
			Field(x => x.FileExtension).Description("Расширение файла");
			Field(x => x.IsActive).Description("Признак активной версии");
			Field(x => x.IsValid).Description("Признак Действует/Отменена");
			Field(x => x.ItObjectId).Description("Код объекта функционирования");

			AddNavigationField(name: "itObject", resolve: context => context.Source.ItObject);

			Field("url", x => attachmentsProvider.GetAttachmentUrl(x, false).Result);
		}
	}
}