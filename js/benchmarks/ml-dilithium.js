import { utf8ToBytes, randomBytes } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/utils/+esm";
import { ml_dsa44, ml_dsa65, ml_dsa87 } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/ml-dsa/+esm";
import { measureTime, convertMsToSeconds, formatBytes } from "../utils/benchmarking.js";

export async function benchmarkMLDilithium(iterations, benchmarkResults) {
  benchmarkResults.MLDilithium = {};
  const dilithiumAlgorithms = {
    "ML-DSA44": ml_dsa44,
    "ML-DSA65": ml_dsa65,
    "ML-DSA87": ml_dsa87
  };
  const message = utf8ToBytes("hello noble");
  for (const [name, algorithm] of Object.entries(dilithiumAlgorithms)) {
    const seed = randomBytes(32);
    const keyGenTime = await measureTime(() => algorithm.keygen(seed), iterations, convertMsToSeconds);
    const keys = algorithm.keygen(seed);
    const signingTime = await measureTime(() => algorithm.sign(keys.secretKey, message), iterations, convertMsToSeconds);
    const signature = algorithm.sign(keys.secretKey, message);
    const verificationTime = await measureTime(() => algorithm.verify(keys.publicKey, message, signature), iterations, convertMsToSeconds);
    benchmarkResults.MLDilithium[name] = {
      keyGenTime,
      signingTime,
      verificationTime,
      keySize: formatBytes(keys.publicKey.length + keys.secretKey.length),
      signatureSize: formatBytes(signature.length)
    };
  }
}
