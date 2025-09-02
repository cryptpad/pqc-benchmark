// SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { randomBytes } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/utils/+esm";
import { ml_kem512, ml_kem768, ml_kem1024 } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/ml-kem/+esm";
import { measureTime, convertMsToSeconds, formatBytes } from "../utils/benchmarking.js";

export async function benchmarkKyber(iterations, benchmarkResults) {
  benchmarkResults.Kyber = {};
  const kyberAlgorithms = {
    "ML-KEM512": ml_kem512,
    "ML-KEM768": ml_kem768,
    "ML-KEM1024": ml_kem1024
  };
  for (const [name, algorithm] of Object.entries(kyberAlgorithms)) {
    const seed = randomBytes(64);
    const keyGenTime = await measureTime(() => algorithm.keygen(seed), iterations, convertMsToSeconds);
    const keys = algorithm.keygen(seed);
    const { publicKey, secretKey } = keys;
    const encapsulationTime = await measureTime(() => algorithm.encapsulate(publicKey), iterations, convertMsToSeconds);
    const { cipherText, sharedSecret } = algorithm.encapsulate(publicKey);
    const decapsulationTime = await measureTime(() => algorithm.decapsulate(cipherText, secretKey), iterations, convertMsToSeconds);
    benchmarkResults.Kyber[name] = {
      keyGenTime,
      encapsulationTime,
      decapsulationTime,
      keySize: formatBytes(publicKey.length + secretKey.length),
      ciphertextSize: formatBytes(cipherText.length),
      sharedSecretSize: formatBytes(sharedSecret.length)
    };
  }
}
