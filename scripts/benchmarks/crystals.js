// SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import dilithiumCrystals from "https://cdn.jsdelivr.net/npm/dilithium-crystals@1.0.6/+esm";
import { measureTime, convertMsToSeconds, formatBytes } from "../utils/benchmarking.js";

export async function benchmarkCrystalsDilithium(iterations, benchmarkResults) {
  const keyPair = await dilithiumCrystals.keyPair();
  const message = new Uint8Array([104,101,108,108,111,0]);
  const keyGenTime = await measureTime(() => dilithiumCrystals.keyPair(), iterations, convertMsToSeconds);
  const signTime = await measureTime(() => dilithiumCrystals.sign(message, keyPair.privateKey), iterations, convertMsToSeconds);
  const signed = await dilithiumCrystals.sign(message, keyPair.privateKey);
  const openTime = await measureTime(() => dilithiumCrystals.open(signed, keyPair.publicKey), iterations, convertMsToSeconds);
  const verified = await dilithiumCrystals.open(signed, keyPair.publicKey);
  const signDetachedTime = await measureTime(() => dilithiumCrystals.signDetached(message, keyPair.privateKey), iterations, convertMsToSeconds);
  const signature = await dilithiumCrystals.signDetached(message, keyPair.privateKey);
  const verifyDetachedTime = await measureTime(() => dilithiumCrystals.verifyDetached(signature, message, keyPair.publicKey), iterations, convertMsToSeconds);

  benchmarkResults.CrystalsDilithium = {
    keyGenTime,
    signTime,
    openTime,
    signDetachedTime,
    verifyDetachedTime,
    keySize: formatBytes(keyPair.publicKey.length),
    signatureSize: formatBytes(signature.length),
    signedSize: formatBytes(signed.length),
    verifiedSize: formatBytes(verified.length)
  };
}
