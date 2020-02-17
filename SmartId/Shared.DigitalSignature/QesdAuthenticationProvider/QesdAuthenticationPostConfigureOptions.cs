using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.DigitalSignature.Authentication
{
    /// <summary>
    /// Used to setup defaults for the OAuthOptions.
    /// </summary>
    public class QesdAuthenticationPostConfigureOptions : IPostConfigureOptions<QesdAuthenticationOptions>
    {
        private readonly IDataProtectionProvider _dp;

        public QesdAuthenticationPostConfigureOptions(IDataProtectionProvider dataProtection)
        {
            _dp = dataProtection;
        }

        public void PostConfigure(string name, QesdAuthenticationOptions options)
        {
            options.DataProtectionProvider = options.DataProtectionProvider ?? _dp;
            if (options.StateDataFormat == null)
            {
                var dataProtector = options.DataProtectionProvider.CreateProtector(typeof(QesdAuthenticationHandler).FullName, name, "v1");
                options.StateDataFormat = new PropertiesDataFormat(dataProtector);
            }
        }
    }
}
