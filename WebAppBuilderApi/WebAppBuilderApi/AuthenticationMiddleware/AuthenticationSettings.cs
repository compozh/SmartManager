using System;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace WebAppBuilderApi.Authentication
{
	public class AuthenticationSettings
	{
		public string Path { get; set; } = "/api/authentication/";
	}
}