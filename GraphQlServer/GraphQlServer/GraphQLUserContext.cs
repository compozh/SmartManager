using System.Security.Claims;

namespace GraphQlServer
{
	public class GraphQLUserContext
	{
		public ClaimsPrincipal User { get; set; }
	}
}