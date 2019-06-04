using System;
using System.Collections.Generic;

namespace ItGraphQlSchema.Types.SmartManager.Model
{
    public class SmartManagerTaskFullInfo
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Descript { get; set; }
        public DateTime Dateplan { get; set; }
        public DateTime DateAdd { get; set; }
        public string Status { get; set; }
        public string Arso { get; set; }
        public string KeyValue { get; set; }
        public bool IsAgree { get; set; }
        public int Priority { get; set; }
        public DateTime DateRemind { get; set; }
        public string AddedId { get; set; }
        public string AddedFio { get; set; }
        public string AddedPhoto { get; set; }
        public DateTime DateFact { get; set; }
        public DateTime DocPlandate { get; set; }
        public List <SmartManagerTaskOriginals> Originals { get; set; }
        public List<SmartManagerTaskComment> Comments { get; set; }
        public  List<SmartManagerTaskFullInfo> Tasks { get; set; }
    }
}