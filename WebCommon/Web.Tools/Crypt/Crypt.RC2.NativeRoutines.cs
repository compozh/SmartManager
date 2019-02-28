using System;
using System.Text;
using System.Runtime.InteropServices;

namespace Web.Tools
{
	partial class Crypt
	{
		partial class RC2
		{
			#region Constants
			private const string MS_DEF_PROV = "Microsoft Base Cryptographic Provider v1.0";

			private const uint PROV_RSA_FULL = 1;
			private const uint CRYPT_VERIFYCONTEXT = 0xf0000000;
			private const uint CRYPT_EXPORTABLE = 0x00000001;

			private const uint ALG_CLASS_HASH = (4 << 13);
			private const uint ALG_TYPE_ANY = (0);
			private const uint ALG_CLASS_DATA_ENCRYPT = (3 << 13);
			private const uint ALG_TYPE_STREAM = (4 << 9);
			private const uint ALG_TYPE_BLOCK = (3 << 9);

			private const uint ALG_SID_DES = 1;
			private const uint ALG_SID_RC4 = 1;
			private const uint ALG_SID_RC2 = 2;
			private const uint ALG_SID_MD5 = 3;

			private const uint CALG_MD5 = (ALG_CLASS_HASH | ALG_TYPE_ANY | ALG_SID_MD5);
			private const uint CALG_DES = (ALG_CLASS_DATA_ENCRYPT | ALG_TYPE_BLOCK | ALG_SID_DES);
			private const uint CALG_RC2 = (ALG_CLASS_DATA_ENCRYPT | ALG_TYPE_BLOCK | ALG_SID_RC2);
			private const uint CALG_RC4 = (ALG_CLASS_DATA_ENCRYPT | ALG_TYPE_STREAM | ALG_SID_RC4);

			private const uint RC2_BLOCK_SIZE = 8;

			private const string CryptDll = "advapi32.dll";
			private const string KernelDll = "kernel32.dll";
			#endregion

			#region CryptoApi
			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptAcquireContext(
				out IntPtr hProvHandle,
				string cContainer,
				string cProvider,
				uint nProvType,
				uint nFlags);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptReleaseContext(
				IntPtr hProvHandle,
				uint nReserved);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptCreateHash(
				IntPtr hProviderHandle,
				uint nALG_ID,
				IntPtr hKeyhandle,
				uint nFlags,
				out IntPtr hCryptHashHandle);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptHashData(
				IntPtr hHashHandle,
				string cData,
				uint nDataLen,
				uint nFlags);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptDestroyHash(
				IntPtr hKeyHandle);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptDeriveKey(
				IntPtr hProv,
				uint Algid,
				IntPtr hBaseData,
				uint dwFlags,
				out IntPtr phKey);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptDestroyKey(
				IntPtr hKey);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptEncrypt(
				IntPtr hKey,
				IntPtr hHash,
				bool Final,
				uint dwFlags,
				byte[] pbData,
				ref uint pdwDataLen,
				uint dwBufLen);

			[DllImport(CryptDll, SetLastError = true)]
			private static extern bool CryptDecrypt(
				IntPtr hKey,
				IntPtr hHash,
				bool Final,
				uint dwFlags,
				byte[] pbData,
				ref uint pdwDataLen);
			#endregion

			# region Error Handling
			private const uint FORMAT_MESSAGE_FROM_SYSTEM = 0x00001000;

			[DllImport(KernelDll)]
			private static extern uint GetLastError();

			[DllImport(KernelDll)]
			private static extern uint FormatMessage(
				uint dwFlags, string lpSource, uint dwMessageId,
				uint dwLanguageId, StringBuilder lpBuffer, uint nSize,
				string[] Arguments);
			#endregion

		}
	}
}
