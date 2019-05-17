using System;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
    public class SmartManagerTaskOriginals
    {
        public int Id { get; set; }
        public int Ndor { get; set; }
        public string FileName { get; set; }
        public string User { get; set; }
        public DateTime date { get; set; }
        public string Comm { get; set; }
        public string TypeName { get; set; }
        public string TypeDescription { get; set; }
        public string File { get; set; }
    }
}