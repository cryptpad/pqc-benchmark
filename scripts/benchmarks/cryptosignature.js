// SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { measureTime, formatBytes } from "../utils/benchmarking.js";

export async function benchmarkCryptoSignature(iterations, results) {
  try {
    if (!results.CryptoSignature) results.CryptoSignature = {};
    
    if (!window.chainpad_crypto) {
      throw new Error("window.chainpad_crypto is not available");
    }
    
    const crypto = window.chainpad_crypto;
    
    const message = "This is a test message for signature verification";
    
    const keyGenTime = await measureTime(async () => {
      return crypto.createEditCryptor2();
    }, iterations);
    
    const keys = crypto.createEditCryptor2();
    
    const signingTime = await measureTime(async () => {
      const encryptor = crypto.createEncryptor({
        cryptKey: keys.cryptKey,
        signKey: keys.signKey
      });
      return encryptor.encrypt(message);
    }, iterations);
    
    const encryptor = crypto.createEncryptor({
      cryptKey: keys.cryptKey,
      signKey: keys.signKey
    });
    const signature = encryptor.encrypt(message);
    
    const verificationTime = await measureTime(async () => {
      const decryptor = crypto.createEncryptor({
        cryptKey: keys.cryptKey
      });
      return decryptor.decrypt(signature, keys.validateKey, true);
    }, iterations);
    
    const signKey = crypto.Nacl.util.decodeBase64(keys.signKey);
    const validateKey = crypto.Nacl.util.decodeBase64(keys.validateKey);
    const signatureBytes = crypto.Nacl.util.decodeBase64(signature);
    
    results.CryptoSignature = {
      keyGenTime,
      signingTime,
      verificationTime,
      keySize: formatBytes(validateKey.length),
      signatureSize: formatBytes(signatureBytes.length)
    };
    
    console.log("Crypto.js Signature benchmark completed");
    return results;
  } catch (error) {
    console.error("Error in Crypto.js Signature benchmark:", error);
    results.CryptoSignature = { 
      keyGenTime: { value: 0, unit: "ms", converted: 0 },
      signingTime: { value: 0, unit: "ms", converted: 0 },
      verificationTime: { value: 0, unit: "ms", converted: 0 },
      keySize: formatBytes(0),
      signatureSize: formatBytes(0),
      error: error.message
    };
    return results;
  }
}
