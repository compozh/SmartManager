using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.DigitalSignature.Authentication
{
	public class QedsAuthenticationDefaults
	{
        /// <summary>
        /// The default authentication type used when registering the QesdAuthenticationHandler.
        /// </summary>
        public const string AuthenticationScheme = "QesdUA";

        /// <summary>
        /// The default display name used when registering the QesdAuthenticationHandler.
        /// </summary>
        public const string DisplayName = "QualifiedElectronicSignatureUA";
    }
}
