using System.Collections.Generic;
using AutoMapper;
using ItGraphQlSchema.Types.Purchases;

namespace  ItGraphQlSchema.Helpers{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<CartItem, CartItem>()
            .ForMember(x=>x.Id, opt=>opt.Ignore())        
            .ForMember(x=>x.SignatureDate, opt=>opt.Ignore())
            .ForMember(x=>x.SignatureUserId, opt=>opt.Ignore())
            .ForMember(x=>x.UserId, opt=>opt.Ignore());
        }
    }

}