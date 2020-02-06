using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.OAuth;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.Authentication.Qedsua
{
	/// <summary>
	/// Квалифицированная ЄЦП UA
	/// </summary>
	public class QedsuaExtensions
	{
		
	}

    /// <summary>
    /// Configuration options for <see cref="GoogleHandler"/>.
    /// </summary>
    public class QedsuaOptions : OAuthOptions
    {
        /// <summary>
        /// Initializes a new <see cref="GoogleOptions"/>.
        /// </summary>
        public QedsuaOptions()
        {
            CallbackPath = new PathString("/signin-qedsua");
            /*
            ClaimActions.MapJsonKey(ClaimTypes.NameIdentifier, "id");
            ClaimActions.MapJsonKey(ClaimTypes.Name, "name");
            ClaimActions.MapJsonKey(ClaimTypes.GivenName, "given_name");
            ClaimActions.MapJsonKey(ClaimTypes.Surname, "family_name");
            ClaimActions.MapJsonKey("urn:google:profile", "link");
            ClaimActions.MapJsonKey(ClaimTypes.Email, "email");
            */
        }
    }

    /// <summary>
    /// Default values for Google authentication
    /// </summary>
    public static class QedsuaDefaults
    {
        public const string AuthenticationScheme = "Qedsua";

        public static readonly string DisplayName = "Qualified EDS of Ukraine";

    }
}
