import { utf8ToBytes, randomBytes } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/utils/+esm";
import { slh_dsa_sha2_128f, slh_dsa_sha2_192f, slh_dsa_sha2_256f } from "https://cdn.jsdelivr.net/npm/@noble/post-quantum/slh-dsa/+esm";
import { measureTime, convertMsToSeconds, formatBytes } from "../utils/benchmarking.js";

export async function benchmarkSPHINCS(iterations, benchmarkResults) {
  benchmarkResults["SPHINCS+"] = {};
  const sphincsAlgorithms = {
    "SLH-DSA-128F": { algorithm: slh_dsa_sha2_128f, seedSize: 48 },
    "SLH-DSA-192F": { algorithm: slh_dsa_sha2_192f, seedSize: 72 },
    "SLH-DSA-256F": { algorithm: slh_dsa_sha2_256f, seedSize: 96 }
  };
  const message = utf8ToBytes("hello noble");
  for (const [name, { algorithm, seedSize }] of Object.entries(sphincsAlgorithms)) {
    const seed = randomBytes(seedSize);
    const keyGenTime = await measureTime(() => algorithm.keygen(seed), iterations, convertMsToSeconds);
    const keys = algorithm.keygen(seed);
    const signingTime = await measureTime(() => algorithm.sign(keys.secretKey, message), iterations, convertMsToSeconds);
    const signature = algorithm.sign(keys.secretKey, message);
    const verificationTime = await measureTime(() => algorithm.verify(keys.publicKey, message, signature), iterations, convertMsToSeconds);
    benchmarkResults["SPHINCS+"][name] = {
      keyGenTime,
      signingTime,
      verificationTime,
      keySize: formatBytes(keys.publicKey.length + keys.secretKey.length),
      signatureSize: formatBytes(signature.length)
    };
  }
}
