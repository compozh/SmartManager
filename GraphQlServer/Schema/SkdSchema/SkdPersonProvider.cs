using System.Collections.Generic;

namespace SkdSchema
{
	public interface ISkdPersonProvider
	{
		IEnumerable<SkdPerson> Persons { get; }
	}

	public class SkdPersonProvider : ISkdPersonProvider
	{
		public IEnumerable<SkdPerson> Persons
		{
			get
			{
				return new List<SkdPerson> {
					new SkdPerson {
						UserId = "3",
						FullName = "Melentyev"
					},new SkdPerson {
						UserId = "4",
						FullName = "Melentyev 1"
					},new SkdPerson {
						UserId = "5",
						FullName = "Melentyev 3"
					},new SkdPerson {
						UserId = "6",
						FullName = "Melentyev 5"
					}
				};
			} 
			
		}
	}
}