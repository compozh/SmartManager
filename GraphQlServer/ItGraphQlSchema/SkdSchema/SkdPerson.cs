using System;

namespace ItGraphQlSchema
{
	public class SkdPerson
	{
		public string UserId { get; set; }
		public string Birthday { get; set; }
		public string Department { get; set; }
		public string Email { get; set; }
		public bool HasKey { get; set; }
		public string HasKeyTitle { get; set; }
		public string PlaceName { get; set; }
		public string FullName { get; set; }
		public DateTime MovementDate { get; set; }
		public string Skype { get; set; }
		public string MobileTel { get; set; }
		public string WorkTel { get; set; }
		public string SensorName { get; set; }
		public bool IsCurrent { get; set; }
	}
}