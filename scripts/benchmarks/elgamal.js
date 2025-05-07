import { measureTime, formatBytes } from "../utils/benchmarking.js";

class ElGamal {
  constructor() {
    this.modulusLength = 2048;
    this.publicExponent = new Uint8Array([0x01, 0x00, 0x01]); // 65537
    this.hashAlgorithm = "SHA-256";
  }

  async generateKeys() {
    const keyPair = await window.crypto.subtle.generateKey(
      {
        name: "RSA-OAEP",
        modulusLength: this.modulusLength,
        publicExponent: this.publicExponent,
        hash: this.hashAlgorithm,
      },
      true,
      ["encrypt", "decrypt"]
    );

    return {
      publicKey: keyPair.publicKey,
      privateKey: keyPair.privateKey
    };
  }

  async encrypt(message, publicKey) {
    const encoder = new TextEncoder();
    const data = encoder.encode(message);

    return await window.crypto.subtle.encrypt(
      {
        name: "RSA-OAEP",
      },
      publicKey,
      data
    );
  }

  async decrypt(ciphertext, privateKey) {
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: "RSA-OAEP",
      },
      privateKey,
      ciphertext
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  }

  async keySize(key) {
    const exportedKey = await window.crypto.subtle.exportKey(
      "spki",
      key
    );

    return exportedKey.byteLength;
  }

  async ciphertextSize(ciphertext) {
    return ciphertext.byteLength;
  }
}

export async function benchmarkElGamal(iterations, results) {
  try {
    if (!results.ElGamal) results.ElGamal = {};

    const elgamal = new ElGamal();
    const testMessage = "This is a test message for ElGamal encryption";

    const keyPair = await elgamal.generateKeys();

    const keyGenTime = await measureTime(async () => {
      await elgamal.generateKeys();
    }, iterations);

    const encryptTime = await measureTime(async () => {
      await elgamal.encrypt(testMessage, keyPair.publicKey);
    }, iterations);

    const ciphertext = await elgamal.encrypt(testMessage, keyPair.publicKey);

    const decryptTime = await measureTime(async () => {
      await elgamal.decrypt(ciphertext, keyPair.privateKey);
    }, iterations);

    const publicKeySize = formatBytes(await elgamal.keySize(keyPair.publicKey));
    const ciphertextSize = formatBytes(await elgamal.ciphertextSize(ciphertext));

    results.ElGamal = {
      keyGenTime: keyGenTime,
      encryptTime: encryptTime,
      decryptTime: decryptTime,
      keySize: publicKeySize,
      ciphertextSize: ciphertextSize
    };

    console.log("ElGamal benchmark completed");
    return results;
  } catch (error) {
    console.error("Error in ElGamal benchmark:", error);
    results.ElGamal = { error: error.message };
    return results;
  }
}
