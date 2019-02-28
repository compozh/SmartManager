namespace Web.Tools
{
	/// <summary>
	/// </summary>
	partial class Crypt
	{
		/// <summary>
		/// Хэш Crc32
		/// </summary>
		public static class Crc32
		{
			/// <summary>
			/// Вычислить хэш из строки в кодировке WIN-1251
			/// </summary>
			/// <param name="s">Строка</param>
			/// <returns>Хэш в hex-формате</returns>
			public static string GenerateHash(string s)
			{
#pragma warning disable 618
				var bytes = Text.Win1251Encoding.GetBytes(s);
#pragma warning restore 618
				return GenerateHash(bytes);
			}

			/// <summary>
			/// Вычислить хэш
			/// </summary>
			/// <param name="bytes"></param>
			/// <returns>Хэш в hex-формате</returns>
			public static string GenerateHash(byte[] bytes)
			{
				const uint poly = 0xedb88320;
				var table = new uint[256];
				for (uint i = 0; i < table.Length; ++i)
				{
					uint temp = i;
					for (int j = 8; j > 0; --j)
					{
						if ((temp & 1) == 1)
						{
							temp = (temp >> 1) ^ poly;
						}
						else
						{
							temp >>= 1;
						}
					}
					table[i] = temp;
				}

				uint crc = 0xffffffff;
				for (int i = 0; i < bytes.Length; ++i)
				{
					byte index = (byte)(((crc) & 0xff) ^ bytes[i]);
					crc = (crc >> 8) ^ table[index];
				}
				return (~crc).ToString("x").ToUpperInvariant();
			}
		}
	}
}
