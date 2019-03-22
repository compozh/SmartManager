using GraphQL.Types;

namespace SkdSchema
{
	public class SkdPersonPhotoType:ObjectGraphType<SkdPersonPhoto>
	{
		public SkdPersonPhotoType()
		{
			Name = "PersonPhotoProperty";
			
			Field(p => p.UserId).Description("Идентификатор пользователя");
			Field(p => p.PhotoUrl).Description("Ссылка на фото");
		}
	}
}