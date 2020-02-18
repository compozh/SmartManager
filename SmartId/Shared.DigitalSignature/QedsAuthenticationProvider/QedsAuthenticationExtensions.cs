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
	public static class QedsAuthenticationExtensions
	{
        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the default authentication scheme, display name, and options.
        /// </summary>
        /// <param name="builder"></param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQedsAuthentication(this AuthenticationBuilder builder)
            => builder.AddQedsAuthentication(QedsAuthenticationDefaults.AuthenticationScheme, _ => { });

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the default authentication scheme, display name, and the given options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQedsAuthentication(this AuthenticationBuilder builder, Action<QedsAuthenticationOptions> configureOptions)
            => builder.AddQedsAuthentication(QedsAuthenticationDefaults.AuthenticationScheme, configureOptions);

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the given authentication scheme, default display name, and the given options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="authenticationScheme"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQedsAuthentication(this AuthenticationBuilder builder, string authenticationScheme, Action<QedsAuthenticationOptions> configureOptions)
            => builder.AddQedsAuthentication(authenticationScheme, QedsAuthenticationDefaults.DisplayName, configureOptions);

        /// <summary>
        /// Registers the <see cref="WsFederationHandler"/> using the given authentication scheme, display name, and options configuration.
        /// </summary>
        /// <param name="builder"></param>
        /// <param name="authenticationScheme"></param>
        /// <param name="displayName"></param>
        /// <param name="configureOptions">A delegate that configures the <see cref="WsFederationOptions"/>.</param>
        /// <returns></returns>
        public static AuthenticationBuilder AddQedsAuthentication(this AuthenticationBuilder builder, string authenticationScheme, string displayName, Action<QedsAuthenticationOptions> configureOptions)
        {
            builder.Services.TryAddEnumerable(ServiceDescriptor.Singleton<IPostConfigureOptions<QedsAuthenticationOptions>, QedsAuthenticationPostConfigureOptions>());
            return builder.AddRemoteScheme<QedsAuthenticationOptions, QedsAuthenticationHandler>(authenticationScheme, displayName, configureOptions);
        }
    }
}
