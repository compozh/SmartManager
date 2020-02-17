using EUSignCP;
using System;
using System.IO;
using System.Reflection;
using System.Runtime.InteropServices;
using System.Runtime.Serialization;
using System.Text;

namespace MobileIdProxy.Helpers
{
	public static class IitHelper
	{
		private const int RTLD_LAZY = 0x00001; //Only resolve symbols as needed
		private const int RTLD_GLOBAL = 0x00100; //Make symbols available to libraries loaded later
		private static CASettings[] cas = null;
		private static object locker = new object();

		public static IntPtr IITContext { get; set; }
		public static CASettings[] Cas { get { return cas; } }
		public static void Init()
		{
			loadLibraries();
			InitIIT();
			IntPtr context;
			IEUSignCP.CtxCreate(out context);
			IITContext = context;
		}

		private static void InitIIT()
		{
			Encoding.RegisterProvider(CodePagesEncodingProvider.Instance);
			Encoding.GetEncoding("windows-1251");
			string rootDir = Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().Location).LocalPath);
			string certDir = Path.Combine(rootDir, "Data");
			string certPath = Path.Combine(certDir, "CACertificates.p7b");
			string casPath = Path.Combine(certDir, "CAs.json");
			lock (locker) {
				// Увімкнення кидання винятків бібліотекою, замість повертання помилок.
				IEUSignCP.SetThrowExceptions(false);

				// Вимкнення завантаження бібліотеки граф. діалогів
				IEUSignCP.SetUIMode(true);

				IEUSignCP.Initialize();

				// Вимкнення збереження налаштувань до реєстру
				IEUSignCP.SetRuntimeParameter(
					IEUSignCP.EU_SAVE_SETTINGS_PARAMETER, IEUSignCP.EU_SETTINGS_ID_NONE);

				// Вимкнення відображення помилок
				IEUSignCP.SetUIMode(true);

				// Використання режиму он-лайн
				IEUSignCP.SetModeSettings(false);

				// Встановлення налаштувань Сховища сертифікатів та СВС
				// Параметр path="" встановлено для використання віртуального сховища сертифікатів та СВС в пам'яті
				IEUSignCP.SetFileStoreSettings("", true, true, true, true, true, true, 3600);

				CASettings pkCA = null;
				System.Runtime.Serialization.Json.DataContractJsonSerializer jsonFormatter =
					new System.Runtime.Serialization.Json.DataContractJsonSerializer(typeof(CASettings[]));
				FileStream fsCAs = new FileStream(
					casPath, FileMode.OpenOrCreate);
				cas = (CASettings[])jsonFormatter.ReadObject(fsCAs);
				foreach (CASettings ca in cas)
				{
					foreach (string commonName in ca.issuerCNs)
					{
						IEUSignCP.SetOCSPAccessInfoSettings(
							commonName, ca.ocspAccessPointAddress,
							ca.ocspAccessPointPort);
					}
				}

				var filePath = Path.GetTempPath();
				var pathFile = Path.Combine(filePath, "certDir.txt");
				File.WriteAllText(pathFile, certDir);
				IEUSignCP.SetUIMode(false);
				IEUSignCP.SetModeSettings(false);

				// Начальные установки
				IEUSignCP.SetProxySettings(false, false, "", "3128", "", "", false);
				IEUSignCP.SetOCSPSettings(true, true, "", "80");
				// Точки доступа OCSP
				IEUSignCP.SetOCSPAccessInfoModeSettings(true);
				IEUSignCP.SetTSPSettings(true, "acskidd.gov.ua", "80");
				IEUSignCP.SetLDAPSettings(false, "", "", true, "", "");
				IEUSignCP.SetCMPSettings(false, "", "", "");

				// Збереження кореневих сертифікатів ЦЗО та АЦСК
				var error = IEUSignCP.SaveCertificates(
					File.ReadAllBytes(certPath));
				var message = IEUSignCP.GetErrorLangDesc(error, IEUSignCP.EU_LANG.RU);
			}
		}

		private static void loadLibraries()
		{
			bool isWindows = RuntimeInformation.IsOSPlatform(OSPlatform.Windows);
			var separator = isWindows ? "\\" : "/";
			var proccess = Environment.Is64BitProcess ? "x64" : "x86";
			var os = isWindows ? "Windows" : "Linux";

			string rootDir = Path.GetDirectoryName(new Uri(Assembly.GetExecutingAssembly().Location).LocalPath);
			string dllDir = Path.Combine(rootDir, $"libs{separator}{os}{separator}{proccess}");
			foreach (var dll in Directory.GetFiles(dllDir, isWindows ? "*.dll" : "*.so"))
			{
				if (isWindows)
				{
					LoadLibrary(dll);
				}
				else
				{
					dlopen(dll, RTLD_LAZY | RTLD_GLOBAL);
				}
			}
		}


		[DllImport("kernel32.dll")]
		public static extern IntPtr LoadLibrary(string dllToLoad);

		[DllImport("libdl.so")]
		public static extern IntPtr dlopen(string filename, int flags);
	}



	[DataContract]
	public class CASettings
	{
		[DataMember]
		public string[] issuerCNs { get; set; }
		[DataMember]
		public string address { get; set; }
		[DataMember]
		public string ocspAccessPointAddress { get; set; }
		[DataMember]
		public string ocspAccessPointPort { get; set; }
		[DataMember]
		public string cmpAddress { get; set; }
		[DataMember]
		public string tspAddress { get; set; }
		[DataMember]
		public string tspAddressPort { get; set; }
		[DataMember]
		public bool directAccess { get; set; }

		public CASettings(string[] issuerCNs, string address,
			string ocspAccessPointAddress, string ocspAccessPointPort,
			string cmpAddress, string tspAddress, string tspAddressPort,
			bool directAccess)
		{
			this.issuerCNs = issuerCNs;
			this.address = address;
			this.ocspAccessPointAddress = ocspAccessPointAddress;
			this.ocspAccessPointPort = ocspAccessPointPort;
			this.cmpAddress = cmpAddress;
			this.tspAddress = tspAddress;
			this.tspAddressPort = tspAddressPort;
			this.directAccess = directAccess;
		}
	}
}
