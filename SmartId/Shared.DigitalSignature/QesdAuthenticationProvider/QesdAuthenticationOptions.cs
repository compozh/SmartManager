using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.DigitalSignature.Authentication
{
	public class QesdAuthenticationOptions : RemoteAuthenticationOptions
    {
        public QesdAuthenticationOptions()
        {
            CallbackPath = new PathString("/signin-qesd");
        }

        /// <summary>
        /// Url с страницей ввода ЭЦП
        /// </summary>
        public string AuthorizationEndpoint { get; set; }

        /// <summary>
        /// Срок жизни запроса на подпись
        /// </summary>
        public int SignQueryLifetime { get; set; } = 15;

        /// <summary>
        /// Построитель ссылки на точку авторизации: Url с страницей ввода ЭЦП
        /// На вход AuthorizationEndpoint, параметры returnUrl, data, state
        /// </summary>
        public Func<string, Dictionary<string, string>, string> AuthorizationEndpointBuilder { get; set; }

        /// <summary>
        /// Gets or sets the type used to secure data handled by the middleware.
        /// </summary>
        public ISecureDataFormat<AuthenticationProperties> StateDataFormat { get; set; }
    }
}
