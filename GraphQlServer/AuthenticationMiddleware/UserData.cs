using System.Collections.Generic;

namespace AuthenticationMiddleware
{
    public class UserData
    {
        public string Name { get; set; }
        public string Login { get; set; }
        public string Id { get; set; }
        public string Image { get; set; }
        public List<DelegatedRights> DelegatedRights { get; set; }
    }
}