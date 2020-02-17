using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Shared.DigitalSignature.Authentication
{
	public static class QesdAuthenticationExtensions
	{
        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the default authentication scheme, display name, and options.
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQesdAuthentication(this AuthenticationBuilder builder)
            => builder.AddQesdAuthentication(QesdAuthenticationDefaults.AuthenticationScheme, _ => { });

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the default authentication scheme, display name, and the given options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQesdAuthentication(this AuthenticationBuilder builder, Action<QesdAuthenticationOptions> configureOptions)
            => builder.AddQesdAuthentication(QesdAuthenticationDefaults.AuthenticationScheme, configureOptions);

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the given authentication scheme, default display name, and the given options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="authenticationScheme"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQesdAuthentication(this AuthenticationBuilder builder, string authenticationScheme, Action<QesdAuthenticationOptions> configureOptions)
            => builder.AddQesdAuthentication(authenticationScheme, QesdAuthenticationDefaults.DisplayName, configureOptions);

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the given authentication scheme, display name, and options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="authenticationScheme"></param>
        /// <param name="displayName"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQesdAuthentication(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<QesdAuthenticationOptions> configureOptions)
        {
            builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<QesdAuthenticationOptions>, QesdAuthenticationPostConfigureOptions>());
            return builder.AddRemoteScheme<QesdAuthenticationOptions, QesdAuthenticationHandler>(authenticationScheme, displayName, configureOptions);
        }
    }
}
