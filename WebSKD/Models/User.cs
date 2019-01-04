using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Vue2Spa.Models
{

    //public class Rootobject
    //{
    //    public User[] Property1 { get; set; }
    //}
    public class User
    {
        //[JsonProperty("Success")]
        public bool Success { get; set; }

        //[JsonProperty("Id")]
        public string Id { get; set; }

        //[JsonProperty("UserName")]
        public string UserName { get; set; }

        //[JsonProperty("Ticket")]
        public string Ticket { get; set; }

        //[JsonProperty("FailReason")]
        public string FailReason { get; set; }

        //[JsonProperty("NeedChangePassword")]
        public string NeedChangePassword { get; set; }

        //[JsonProperty("TempPasswordRequired")]
        public string TempPasswordRequired { get; set; }

        //[JsonProperty("TempPasswordMessage")]
        public string TempPasswordMessage { get; set; }

        public string Photo;
    }
}
