using IdentityModel;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using SmartId.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace SmartId.Authentication
{
	public class SmartIdClaimsPrincipalFactory : UserClaimsPrincipalFactory<SmartIdUser>
	{
		public SmartIdClaimsPrincipalFactory(
			UserManager<SmartIdUser> userManager,
			IOptions<IdentityOptions> optionsAccessor)
			: base(userManager, optionsAccessor)
		{
		}

		protected override async Task<ClaimsIdentity> GenerateClaimsAsync(SmartIdUser user)
		{
			var identity = await base.GenerateClaimsAsync(user).ConfigureAwait(false);
			if (!string.IsNullOrWhiteSpace(user.Email))
			{
				identity.AddClaims(new[] {
					new Claim(JwtClaimTypes.Email, user.Email),
				});
			}
			//identity.AddClaim(new Claim("ContactName", user.ContactName ?? "[Click to edit profile]"));
			return identity;
		}
	}
}
