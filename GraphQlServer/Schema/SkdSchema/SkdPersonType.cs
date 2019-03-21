using GraphQL.Types;

namespace SkdSchema
{
	public class SkdPersonType:ObjectGraphType<SkdPerson>
	{
		public SkdPersonType()
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
			Field(p => p.PhotoUrl).Description("Ссылка на фото");
			Field(p => p.MobileTel).Description("Мобильный телефон");
			Field(p => p.PlaceName).Description("Место нахождения");
			Field(p => p.MovementDate).Description("Дата и время последнего движения");

		}
	}
}