using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkdLogic.Models
{
    public class UserInfo
    {
        [JsonProperty("PHOTO")]
        public string Photo { get; set; }
        [JsonProperty("USERID")]
        public string UserID { get; set; }
    }
}
