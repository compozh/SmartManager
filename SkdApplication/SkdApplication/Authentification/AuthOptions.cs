using Microsoft.IdentityModel.Tokens;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Authentification;

namespace SkdApplication.Authentification
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
