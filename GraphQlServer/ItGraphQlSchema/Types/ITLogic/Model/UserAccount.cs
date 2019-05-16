using GraphQL.Types;

namespace ItGraphQlSchema.Types.ITLogic.Model
{
    [AtributeAddInDI]
    public class UserAccount : ObjectGraphType<UserAccount>
    {
        public UserAccount()
        {
            Name = "User";
            Field(p => p.FullName);
            Field(p => p.LinkToPhoto);
            Field(p => p.Email);
            Field(p => p.DateBirthday);
        }

        public string FullName { get; set; }
        public string LinkToPhoto { get; set; }
        public string Email { get; set; }
        public string DateBirthday { get; set; }
    }
}