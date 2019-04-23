using GraphQL.Types;

namespace ItGraphQlSchema.Types
{
	public class SkdPersonType : ObjectGraphType<SkdPerson>
	{
		public SkdPersonType(ISkdPersonProvider provider)
		{
			Name = "Person";

			Field(p => p.UserId).Description("Идентификатор пользователя");
			Field(p => p.Email).Description("e-mail");
			Field(p => p.Skype).Description("skype");
			Field(p => p.Birthday).Description("Дата рождения");
			Field(p => p.Department).Description("Команда");
			Field(p => p.HasKey).Description("Признак наличия ключа от офиса");
			Field(p => p.WorkTel).Description("Рабочий телефон");
			Field(p => p.FullName).Description("Фамилия Имя");
			Field(p => p.MobileTel).Description("Мобильный телефон");
			Field(p => p.PlaceName).Description("Место нахождения");
			Field(p => p.HasKeyTitle).Description("Определение строки от признака наличия ключа от офиса");
			Field<DateTimeGraphType>("MovementDate", "Дата и время последнего движения");

			Field<SkdPersonPhotoType>("PhotoProperty",
				resolve: context => provider.GetPersonPhoto(context.Source.UserId), description: "Ссылка на фото");

		}
	}
}
