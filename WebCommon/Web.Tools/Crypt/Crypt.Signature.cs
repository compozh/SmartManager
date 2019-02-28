using System;
using System.Security.Cryptography;
using System.Xml;

namespace Web.Tools
{
	partial class Crypt
	{
		/// <summary>
		/// Цифровая подпись алгоритмом RSA
		/// </summary>
		public static class Signature
		{
			/// <summary>
			/// Строка для проверки корректности расшифровки ключа
			/// </summary>
			private const string _checkNodeValue = "ITSignatureKey";
			private const string _checkNodeName = "IT";
			private const string _userIdNodeName = "UserId";
			private const string _keyIdNodeName = "KeyId";

			private const string _hashAlgorithm = "MD5";

			private static RSACryptoServiceProvider getProvider()
			{
				return new RSACryptoServiceProvider(new CspParameters { ProviderType = 1 });
			}

			/// <summary>
			/// Сгенерировать пару ключей (в XML-формате)
			/// </summary>
			/// <param name="privateKeyPassword">Пароль приватного ключа</param>
			/// <param name="userId">Пользователь IT, для которого генерируется ключ</param>
			/// <param name="keyId">ИД ключа</param>
			/// <returns></returns>
			public static KeyPair GenerateKeys(string privateKeyPassword, string userId, int keyId)
			{
				var rsaProvider = getProvider();
				var publicKey = rsaProvider.ToXmlString(false);
				var privateKey = addPrivateKeyInfo(rsaProvider.ToXmlString(true), userId, keyId);
				return new KeyPair(encryptKey(privateKey, privateKeyPassword), publicKey);
			}

			/// <summary>
			/// Добавить ключ для проверки корректности расшифровки значения
			/// </summary>
			/// <param name="privateKey"></param>
			/// <param name="userId"> </param>
			/// <param name="keyId"> </param>
			/// <returns></returns>
			private static string addPrivateKeyInfo(string privateKey, string userId, int keyId)
			{
				var xml = keyToXmlDocument(privateKey);
				// Добавить доп. информацию в приватный ключ
				addPrivateKeyNode(xml, _checkNodeName, _checkNodeValue); // Нода для проверки "xml-файл - это приватный ключ, сгенерированный IT"
				addPrivateKeyNode(xml, _userIdNodeName, userId); // userid
				addPrivateKeyNode(xml, _keyIdNodeName, Text.Convert(keyId)); // keyid
				return xml.InnerXml;
			}

			private static void addPrivateKeyNode(XmlDocument privateKeyXml, string nodeName, string nodeValue)
			{
				var node = privateKeyXml.CreateNode(XmlNodeType.Element, nodeName, null);
				node.InnerText = nodeValue;
				privateKeyXml.FirstChild.AppendChild(node);
			}

			/// <summary>
			/// Зашифровать приватный ключ
			/// </summary>
			/// <param name="key"></param>
			/// <param name="password"></param>
			/// <returns></returns>
			private static string encryptKey(string key, string password)
			{
				return cryptKey(key,password,Encrypt);
			}

			/// <summary>
			/// Расшифровать приватный ключ
			/// </summary>
			/// <param name="key"></param>
			/// <param name="password"></param>
			/// <returns></returns>
			public static string DecryptKey(string key, string password)
			{
				return cryptKey(key, password, Decrypt);
			}


			/// <summary>
			/// Приватный ключ корректен
			/// </summary>
			/// <param name="privateKey"></param>
			/// <returns></returns>
			public static bool PrivateKeyCorrect(string privateKey)
			{
				return getPrivateKeyItNode(privateKey) != null;
			}



			/// <summary>
			/// Получить владельца приватного ключа
			/// </summary>
			/// <param name="privateKey"></param>
			/// <returns></returns>
			public static string GetPrivateKeyOwner(string privateKey)
			{
				var node = getPrivateKeyNode(privateKey, _userIdNodeName);
				return node == null ? string.Empty : node.InnerText;
			}

			/// <summary>
			/// Получить ИД приватного ключа
			/// </summary>
			/// <param name="privateKey"></param>
			/// <returns></returns>
			public static int GetPrivateKeyId(string privateKey)
			{
				var node = getPrivateKeyNode(privateKey, _keyIdNodeName);
				return node == null ? 0 : Text.ToInt32(node.InnerText);
			}


			/// <summary>
			/// Получить из XML приватного ключа спец. ноду, добавляемую IT
			/// </summary>
			/// <param name="privateKey"></param>
			/// <returns></returns>
			private static XmlNode getPrivateKeyItNode(string privateKey)
			{
				return getPrivateKeyNode(privateKey, _checkNodeName);
			}

			private static XmlNode getPrivateKeyNode(string privateKey, string nodeName)
			{
				XmlDocument xml;
				try
				{
					xml = keyToXmlDocument(privateKey);
				}
				catch (Exception)
				{
					return null;
				}
				foreach (XmlNode node in xml.FirstChild.ChildNodes)
				{
					if (node.Name == nodeName)
					{
						return node;
					}
				}
				return null;
			}

			/// <summary>
			/// Приватный ключ зашифрован
			/// </summary>
			/// <param name="privateKey"></param>
			/// <returns></returns>
			public static bool PrivateKeyEncrypted(string privateKey)
			{
				var itXmlNode = getPrivateKeyItNode(privateKey);
				if (itXmlNode == null)
				{
					throw new ArgumentException();
				}
				return itXmlNode.InnerText != _checkNodeValue;
			}

			/// <summary>
			/// Шифрование приватного ключа
			/// </summary>
			/// <param name="key"></param>
			/// <param name="password"></param>
			/// <param name="cryptFunction"></param>
			/// <returns></returns>
			private static string cryptKey(string key, string password, Func<string,string,string> cryptFunction)
			{
				if (string.IsNullOrWhiteSpace(password))
				{
					return key;
				}
				var xmlKey = keyToXmlDocument(key);

				foreach (XmlNode node in xmlKey.FirstChild.ChildNodes)
				{
					node.InnerText = cryptFunction(node.InnerText, password);
				}
				return xmlKey.InnerXml;
			}

			private static XmlDocument keyToXmlDocument(string key)
			{
				var xmlKey = new XmlDocument();
				xmlKey.LoadXml(key);
				return xmlKey;
			}

			/// <summary>
			/// Подписать хэш
			/// </summary>
			/// <param name="hash">Хэш MD5 в кодировке base64</param>
			/// <param name="privateKey">Приватный ключ</param>
			/// <returns>Подпись файла в кодировке base64</returns>
			public static string SignHash(string hash, string privateKey)
			{
				var rsaProvider = getProvider();
				// Импортировать ключ
				rsaProvider.FromXmlString(privateKey);
				// Вычислить подпись
				var signature = rsaProvider.SignHash(Convert.FromBase64String(hash), _hashAlgorithm);
				// Преобразовать в base64
				return Convert.ToBase64String(signature);
			}

			/// <summary>
			/// Встроить в хэш информацию о подписи
			/// </summary>
			/// <param name="hash"></param>
			/// <param name="project"></param>
			/// <param name="userId"></param>
			/// <param name="keyId"></param>
			/// <param name="userName"></param>
			/// <param name="signatureTime"></param>
			/// <returns></returns>
			public static string EmbeddSignatureInfoToHash(string hash, string project, string userId, int keyId, string userName, DateTime signatureTime)
			{
				string extendedString = string.Format("{0}.{1}.{2}.{3}.{4}.{5}",
					hash,
					project.ToUpperInvariant().TrimEnd(),
					userId.ToUpperInvariant().TrimEnd(),
					Text.Convert(keyId),
					userName.TrimEnd(),
					Text.Convert(signatureTime));
				return MD5.GetHashBase64(extendedString);
			}

			
			/// <summary>
			/// Верификация подписи по встроенному ключу
			/// </summary>
			/// <param name="hash"></param>
			/// <param name="signature"></param>
			/// <returns></returns>
			//[Reflection.AllowPrivateReflectionAttribute]
			private static bool verifySignature(string hash, string signature)
			{
				// Публичный ключ
				const string publicKey = @"<RSAKeyValue><Modulus>1WFuWgITuDQm7abwDCnqzW3zriW8J4SQdGW/tBLLJpyNtmPc+I5wf8M9VI2VKpkvpwD9qOxHCfmgfOkJka/zDx0sMbTz6lML1TWPYcwAKuEAFAUCqQHdq4h5WV8MTFp2Jqxnt9IMKSSOajPxgaX0k1cN6NA8/ZAW8eeLNzPQQh0=</Modulus><Exponent>AQAB</Exponent></RSAKeyValue>";
				// Сверить подпись
				return VerifySignature(hash, signature, publicKey);
			}

			/// <summary>
			/// Верификация подписи
			/// </summary>
			/// <param name="hash">Хеш MD5 для верификации в кодировке base64</param>
			/// <param name="signature">Подпись в кодировке base64</param>
			/// <param name="publicKey">Публичный ключ</param>
			/// <returns></returns>
			public static bool VerifySignature(string hash, string signature, string publicKey)
			{
				var rsaProvider = getProvider();
				// Импортировать ключ
				rsaProvider.FromXmlString(publicKey);
				// Верифицировать
				byte[] hashData;
				try
				{
					hashData = Convert.FromBase64String(hash);
				}
				catch (Exception)
				{
					return false;
				}
				byte[] signatureData;
				try
				{
					signatureData = Convert.FromBase64String(signature);
				}
				catch (Exception)
				{
					return false;
				}
				return rsaProvider.VerifyHash(hashData, CryptoConfig.MapNameToOID(_hashAlgorithm), signatureData);
			}

			/// <summary>
			/// Пара ключей открытый/закрытый
			/// </summary>
			public class KeyPair
			{
				/// <summary>
				/// Приватный ключ (XML-формат)
				/// </summary>
				public string PrivateKey {get; private set;}
				/// <summary>
				/// Публичный ключ (XML-формат)
				/// </summary>
				public string PublicKey { get; private set; }
				internal KeyPair(string privateKey, string publicKey)
				{
					PrivateKey = privateKey;
					PublicKey = publicKey;
				}
			}
		}
	}
}
