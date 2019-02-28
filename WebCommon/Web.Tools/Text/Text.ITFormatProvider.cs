using System;
using System.Globalization;

namespace Web.Tools
{
	partial class Text
	{
		/// <summary>
		/// Региональные форматы, принятые в IT-Enterprise
		/// </summary>
		public class ITFormatProvider : IFormatProvider
		{
			public object GetFormat(Type formatType)
			{
				if (formatType == typeof(NumberFormatInfo))
				{
					return PointDecimalSeparator;
				}
				if (formatType == typeof(DateTimeFormatInfo))
				{
					return DateTimeFormat;
				}
				return null;
			}
		}

	}
}
