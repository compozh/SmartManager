using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.IdentityModel.Tokens;

namespace Web.Authentication
{
	public interface IIdentityProvider
	{
		Task<User> GetUser(string login, string password);
	}

	public interface IAuthOptions
	{
		string Issuer { get; } // издатель токена
		string Audience { get; } // потребитель токена
		string Key { get; }   // ключ для шифрации
		int Lifetime { get; } // время жизни токена
		SymmetricSecurityKey GetSymmetricSecurityKey();
	}
}
