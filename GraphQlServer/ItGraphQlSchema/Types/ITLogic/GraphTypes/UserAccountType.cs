using GraphQL.Types;
using ItGraphQlSchema.Types.ITLogic.Model;

namespace ItGraphQlSchema.Types.ITLogic.GraphTypes
{
    [AddInDIAttribute]
    public class UserAccountType: ObjectGraphType<UserAccount>
    {
        public UserAccountType()
        {
            Name = "User";
            Field(p => p.LastName);
            Field(p => p.FirstName);
            Field(p => p.Patronymic);
            Field(p => p.Photo);
            Field(p => p.Email);
            Field(p => p.DateBirthday);
        }
    }
}