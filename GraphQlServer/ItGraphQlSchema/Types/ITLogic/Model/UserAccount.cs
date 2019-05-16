using GraphQL.Types;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
    [AtributeAddInDI]
    public class UserAccount : ObjectGraphType<UserAccount>
    {
        public UserAccount()
        {
            Name = "User";
            Field(p => p.LastName);
            Field(p => p.FirstName);
            Field(p => p.Patronymic);
            Field(p => p.Photo);
            Field(p => p.Email);
            Field(p => p.DateBirthday);
        }

        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string Patronymic { get; set; }
        public string Email { get; set; }
        public string DateBirthday { get; set; }

        public string Photo
        {
            get;
            set;
        }

    }
}