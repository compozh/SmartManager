using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vue2Spa.Models
{
    public class UserInfo
    {
        //[JsonProperty("EMAIL")]
        //public string Email { get; set; }
        //[JsonProperty("FIO")]
        //public string FIO { get; set; }
        //[JsonProperty("HASH")]
        //public string Hash { get; set; }
        //[JsonProperty("PHONE")]
        //public string Phone { get; set; }
        [JsonProperty("PHOTO")]
        public string Photo { get; set; }
        [JsonProperty("USERID")]
        public string UserID { get; set; }


        //public string BIRTHDAY { get; set; }
        //public string DEPARTMENT { get; set; }
        //public string EMAIL { get; set; }
        //public string EXITED { get; set; }
        //public string HASKEY { get; set; }
        //public string H_NAME { get; set; }
        //public string KEYOWNER { get; set; }
        //public string KITF { get; set; }
        //public string OTDELID { get; set; }
        //public string PLACENAME { get; set; }
        //public string P_FIO { get; set; }
        //public string R_DT { get; set; }
        //public string SKYPE { get; set; }
        //public string TEL { get; set; }
        //public string TEL2 { get; set; }
        //public string USERID { get; set; }
        //public string PHOTO { get; set; }
    }
}
