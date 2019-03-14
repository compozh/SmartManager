using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace SkdLogic.Models
{
    public class AllUserInfo
    {
        [JsonProperty("P_FIO")]
        public string FIO { get; set; }

        [JsonProperty("BIRTHDAY")]
        public string Birthday { get; set; }

        [JsonProperty("DEPARTMENT")]
        public string Departament { get; set; }

        [JsonProperty("PLACENAME")]
        public string Place { get; set; }

        [JsonProperty("H_NAME")]
        public string SensorName { get; set; }

        [JsonProperty("R_DT")]
        public string Time { get; set; }

        [JsonProperty("TEL")]
        public string MobileTel { get; set; }

        [JsonProperty("TEL2")]
        public string Tel { get; set; }

        [JsonProperty("EMAIL")]
        public string Email { get; set; }

        [JsonProperty("SKYPE")]
        public string Skype { get; set; }

        [JsonProperty("USERID")]
        public string UserID { get; set; }

        public string Photo { get; set; }
        
		[JsonProperty("IsCurrent")]
        public bool IsCurrent { get; set; }

	    [JsonProperty("HASKEY")]
	    public string HASKEY { get; set; }
	}
}
