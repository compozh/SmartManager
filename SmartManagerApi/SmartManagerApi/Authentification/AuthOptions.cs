using Web.Authentication;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace SmartManagerApi.Authentification

{
	public class AuthOptions : IAuthOptions
	{
		public string Issuer => "It-Enterprise";
		public string Audience => "http://localhost:15194/";// потребитель токена
		public string Key => "8233630C-D63C-4453-9853-2912F7B86ECC";// ключ для шифрации
		public int Lifetime => 10000; // время жизни токена - 1 минута

		public SymmetricSecurityKey GetSymmetricSecurityKey()
		{
			return new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Key));
		}
	}
}
