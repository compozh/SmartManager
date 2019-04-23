using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class SkdPersonPhotoType : ObjectGraphType<SkdPersonPhoto>, IItAddInSingleton
	{
		public SkdPersonPhotoType()
		{
			Name = "PersonPhotoProperty";

			Field(p => p.UserId).Description("Идентификатор пользователя");
			Field(p => p.PhotoUrl).Description("Ссылка на фото");
		}
	}
}
