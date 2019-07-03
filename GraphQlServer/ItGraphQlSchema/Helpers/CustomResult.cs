using System.Collections.Generic;

namespace  ItGraphQlSchema.Helpers{
    public class CustomResult{
        public bool Successed{get;set;}
        public List<string> Message{get;set;}
        public object ReturnValue{get;set;}

        public CustomResult(){
            this.Successed = true;
            this.Message = new List<string>();
        }
    }
}