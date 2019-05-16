using GraphQL.Types;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
    public class UserAccount 
    {
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Patronymic { get; set; }
        public string Email { get; set; }
        public string DateBirthday { get; set; }
        public string Photo { get; set; }

    }
}