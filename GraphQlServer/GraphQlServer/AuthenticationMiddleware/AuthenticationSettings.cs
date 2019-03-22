using System;
using System.IO;
using Microsoft.AspNetCore.Http;

namespace GraphQlServer.Authentication
{
	public class AuthenticationSettings
	{
		public string Path { get; set; } = "/api/authentication/login";
	}
}