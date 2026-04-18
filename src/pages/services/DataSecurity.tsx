import { useState } from "react";
import dataSecurityImg from "/medirator_images/datasecurity.png";


interface DataSecurityProps {
  darkMode?: boolean;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();
const toArrayBuffer = (bytes: Uint8Array) => {
  const buffer = new ArrayBuffer(bytes.byteLength);
  new Uint8Array(buffer).set(bytes);
  return buffer;
};

const getKeyMaterial = async (passphrase: string) =>
  crypto.subtle.importKey("raw", encoder.encode(passphrase), "PBKDF2", false, ["deriveKey"]);

const deriveAesKey = async (passphrase: string, salt: ArrayBuffer) => {
  const keyMaterial = await getKeyMaterial(passphrase);
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
};

const toBase64 = (bytes: Uint8Array) => btoa(String.fromCharCode(...bytes));

const fromBase64 = (value: string) => Uint8Array.from(atob(value), (char) => char.charCodeAt(0));

const DataSecurity = ({ darkMode = false }: DataSecurityProps) => {
  const [plainText, setPlainText] = useState("");
  const [passphrase, setPassphrase] = useState("");
  const [encryptedValue, setEncryptedValue] = useState("");
  const [decryptedValue, setDecryptedValue] = useState("");
  const [status, setStatus] = useState("");
  const [isWorking, setIsWorking] = useState(false);

  const handleEncrypt = async () => {
    if (!plainText.trim() || !passphrase.trim()) {
      setStatus("Please enter data and passphrase.");
      return;
    }

    try {
      setIsWorking(true);
      setStatus("");
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const salt = crypto.getRandomValues(new Uint8Array(16));
      const key = await deriveAesKey(passphrase, toArrayBuffer(salt));
      const encryptedBuffer = await crypto.subtle.encrypt(
        { name: "AES-GCM", iv: toArrayBuffer(iv) },
        key,
        encoder.encode(plainText)
      );

      const encryptedBytes = new Uint8Array(encryptedBuffer);
      setEncryptedValue(`${toBase64(salt)}.${toBase64(iv)}.${toBase64(encryptedBytes)}`);
      setDecryptedValue("");
      setStatus("Data encrypted successfully.");
    } catch {
      setStatus("Encryption failed. Please try again.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleDecrypt = async () => {
    if (!encryptedValue.trim() || !passphrase.trim()) {
      setStatus("Please enter encrypted data and passphrase.");
      return;
    }

    try {
      setIsWorking(true);
      setStatus("");
      const [saltB64, ivB64, cipherB64] = encryptedValue.split(".");
      if (!saltB64 || !ivB64 || !cipherB64) {
        setStatus("Invalid encrypted value format.");
        return;
      }

      const salt = fromBase64(saltB64);
      const iv = fromBase64(ivB64);
      const cipher = fromBase64(cipherB64);
      const key = await deriveAesKey(passphrase, toArrayBuffer(salt));
      const decryptedBuffer = await crypto.subtle.decrypt(
        { name: "AES-GCM", iv: toArrayBuffer(iv) },
        key,
        toArrayBuffer(cipher)
      );

      setDecryptedValue(decoder.decode(decryptedBuffer));
      setStatus("Data decrypted successfully.");
    } catch {
      setDecryptedValue("");
      setStatus("Decryption failed. Check passphrase or data.");
    } finally {
      setIsWorking(false);
    }
  };

  const handleClear = () => {
    setPlainText("");
    setPassphrase("");
    setEncryptedValue("");
    setDecryptedValue("");
    setStatus("Fields cleared.");
  };

  return (
    <div className={darkMode ? "dark" : ""}>
      <div className="flex justify-between items-center bg-[#0B3C5D] dark:bg-black text-white p-6 shadow-md">
        <div>
          <h2 className="text-5xl font-bold">Data Security</h2>
          <p className="mt-2">
            Your healthcare data is protected with secure access, <br />
            privacy-focused controls, and safe handling practices <br />
            built for sensitive medical information.
          </p>
        </div>
        <img src={dataSecurityImg} alt="Data Security" className="h-70 w-70" loading="lazy" />
      </div>

      <div className="bg-white dark:bg-black min-h-screen px-6 py-8">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-[#0B3C5D] dark:text-white">Encrypt Records</h3>

            <label className="block mt-4 text-sm font-semibold text-[#0B3C5D] dark:text-white">Sensitive Data</label>
            <textarea
              value={plainText}
              onChange={(event) => setPlainText(event.target.value)}
              rows={4}
              placeholder="Enter patient notes"
              className="w-full mt-2 rounded-xl border border-[#0B3C5D] bg-white dark:bg-black/40 px-3 py-2 text-[#1F2937] dark:text-white placeholder:text-[#6B7280] dark:placeholder:text-gray-300 placeholder:opacity-100 outline-none transition-all duration-200 hover:border-[#0B3C5D]"
            />

            <label className="block mt-4 text-sm font-semibold text-[#0B3C5D] dark:text-white">Passphrase</label>
            <input
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
              placeholder="Enter passphrase"
              className="w-full mt-2 rounded-xl border border-[#0B3C5D] bg-white dark:bg-black/40 px-3 py-2 text-[#1F2937] dark:text-white placeholder:text-[#6B7280] dark:placeholder:text-gray-300 placeholder:opacity-100 outline-none transition-all duration-200 hover:border-[#0B3C5D]"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={handleEncrypt}
                disabled={isWorking}
                className="px-4 py-2 rounded-2xl border border-[#0B3C5D] dark:bg-black text-[#0B3C5D] dark:hover:bg-gray-800  dark:text-white font-semibold hover:bg-[#0B3C5D] hover:text-white transition-all duration-200 disabled:opacity-60"
              >
                Encrypt Data
              </button>
              <button
                onClick={handleDecrypt}
                disabled={isWorking}
                className="px-4 py-2 rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black dark:hover:bg-gray-800  text-[#0B3C5D] dark:text-white font-semibold hover:bg-[#0B3C5D] hover:text-white transition-all duration-200 disabled:opacity-60"
              >
                Decrypt Data
              </button>
              <button
                onClick={handleClear}
                className="px-4 py-2 rounded-2xl border border-[#0B3C5D] bg-white dark:bg-black text-[#0B3C5D] dark:text-white font-semibold hover:bg-[#0B3C5D] hover:text-white dark:hover:bg-gray-800 transition-all duration-200"
              >
                Clear Fields
              </button>
            </div>
          </div>

          <div className="rounded-2xl border-2 border-[#0B3C5D] bg-[#F7FAFC] dark:bg-[#0B3C5D]/20 p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-2xl font-bold text-[#0B3C5D] dark:text-white">Security Output</h3>
            

            <label className="block mt-4 text-sm font-semibold text-[#0B3C5D] dark:text-white">Encrypted Value</label>
            <textarea
              value={encryptedValue}
              onChange={(event) => setEncryptedValue(event.target.value)}
              rows={5}
              placeholder="Encrypted value appears here"
              className="w-full mt-2 rounded-xl border border-[#0B3C5D] bg-white dark:bg-black/40 px-3 py-2 text-[#1F2937] dark:text-white placeholder:text-[#6B7280] dark:placeholder:text-gray-300 placeholder:opacity-100 outline-none transition-all duration-200 hover:border-[#0B3C5D]"
            />

            <label className="block mt-4 text-sm font-semibold text-[#0B3C5D] dark:text-white">Decrypted Result</label>
            <textarea
              value={decryptedValue}
              readOnly
              rows={4}
              placeholder="Decrypted result appears here"
              className="w-full mt-2 rounded-xl border border-[#0B3C5D] bg-white dark:bg-black/40 px-3 py-2 text-[#1F2937] dark:text-white placeholder:text-[#6B7280] dark:placeholder:text-gray-300 placeholder:opacity-100 outline-none transition-all duration-200 hover:border-[#0B3C5D]"
            />

            {status && (
              <div className="mt-4 rounded-xl bg-[#0B3C5D]/10 dark:bg-white/10 p-3 text-sm text-[#0B3C5D] dark:text-gray-200">
                {status}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataSecurity;
