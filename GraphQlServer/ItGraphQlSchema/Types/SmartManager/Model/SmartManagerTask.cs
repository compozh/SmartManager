using System;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
    public class SmartManagerTask
    {
        public int Id { get; set; }
        public string name { get; set; }
        public string addedFio { get; set; }
        public string addedPhoto { get; set; }
        public DateTime dateadd { get; set; }
        public int caseid { get; set; }
    }
}