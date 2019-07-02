using System.Collections.Generic;

namespace  ItGraphQlSchema.Custom{
    public class CustomResult{
        public bool Successed{get;set;}
        public List<string> Message{get;set;}
        public object ReturnValue{get;set;}
    }
}