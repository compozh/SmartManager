using System;
using System.Collections.Generic;
using System.Text;
using GraphQL.Types;
using SkdSchema;

namespace SkdSchema.Types
{
	public class SkdPersonPhotoType : ObjectGraphType<SkdPersonPhoto>
	{
		public SkdPersonPhotoType()
		{
			Name = "PersonPhotoProperty";

			Field(p => p.UserId).Description("Идентификатор пользователя");
			Field(p => p.PhotoUrl).Description("Ссылка на фото");
		}
	}
}
