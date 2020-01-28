using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace SmartId.ViewModels
{
	public class ExternalProvider
	{
		public string DisplayName { get; set; }
		public string AuthenticationScheme { get; set; }
	}

	public class LoggedOutViewModel
	{
		public string PostLogoutRedirectUri { get; set; }
		public string ClientName { get; set; }
		public string SignOutIframeUrl { get; set; }

		public bool AutomaticRedirectAfterSignOut { get; set; }

		public string LogoutId { get; set; }
		public bool TriggerExternalSignout => ExternalAuthenticationScheme != null;
		public string ExternalAuthenticationScheme { get; set; }
	}
	public class LoginInputModel
	{
		[Required]
		public string Username { get; set; }
		[Required]
		public string Password { get; set; }
		public bool RememberLogin { get; set; }
		public string ReturnUrl { get; set; }
	}

	public class LoginViewModel : LoginInputModel
	{
		public bool AllowRememberLogin { get; set; } = true;
		public bool EnableLocalLogin { get; set; } = true;

		public IEnumerable<ExternalProvider> ExternalProviders { get; set; } = Enumerable.Empty<ExternalProvider>();
		public IEnumerable<ExternalProvider> VisibleExternalProviders => ExternalProviders.Where(x => !String.IsNullOrWhiteSpace(x.DisplayName));

		public bool IsExternalLoginOnly => EnableLocalLogin == false && ExternalProviders?.Count() == 1;
		public string ExternalLoginScheme => IsExternalLoginOnly ? ExternalProviders?.SingleOrDefault()?.AuthenticationScheme : null;
	}

	public class LogoutInputModel
	{
		public string LogoutId { get; set; }
	}

	public class LogoutViewModel : LogoutInputModel
	{
		public bool ShowLogoutPrompt { get; set; } = true;
	}

	public class RedirectViewModel
	{
		public string RedirectUrl { get; set; }
	}

	public class ConfirmEmailViewModel
	{
		public string Email { get; set; }
	}

	public class StatusMessageViewModel
	{
		public string StatusMessage { get; set; }
	}

	public class RegisterInputModel
	{
		[Required]
		[EmailAddress]
		[Display(Name = "Email")]
		public string Email { get; set; }

		[Required]
		[StringLength(100, ErrorMessage = "The {0} must be at least {2} and at max {1} characters long.", MinimumLength = 6)]
		[DataType(DataType.Password)]
		[Display(Name = "Password")]
		public string Password { get; set; }

		[DataType(DataType.Password)]
		[Display(Name = "Confirm password")]
		[Compare("Password", ErrorMessage = "The password and confirmation password do not match.")]
		public string ConfirmPassword { get; set; }

		public string ReturnUrl { get; set; }
	}

	public class RegisterViewModel: RegisterInputModel
	{
		public IEnumerable<ExternalProvider> ExternalProviders { get; set; } = Enumerable.Empty<ExternalProvider>();
		public IEnumerable<ExternalProvider> VisibleExternalProviders => ExternalProviders.Where(x => !String.IsNullOrWhiteSpace(x.DisplayName));

		public string ReturnUrl { get; set; }

	}
}
