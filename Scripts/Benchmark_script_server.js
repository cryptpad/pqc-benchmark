import { performance } from "perf_hooks";
import fs from "fs";

import { ml_kem512, ml_kem768, ml_kem1024 } from "@noble/post-quantum/ml-kem";
import { ml_dsa44, ml_dsa65, ml_dsa87 } from "@noble/post-quantum/ml-dsa";
import {
    slh_dsa_sha2_128f,
    slh_dsa_sha2_192f,
    slh_dsa_sha2_256f
} from "@noble/post-quantum/slh-dsa";
import { utf8ToBytes, randomBytes } from "@noble/post-quantum/utils";


const ITERATIONS = 30000;
const SPHINCS_ITERATIONS = 30000;


let benchmarkResults = {};


function measureTime(label, fn, iterations) {
    const start = performance.now();
    for (let i = 0; i < iterations; i++) fn();
    const end = performance.now();
    const timeTakenMs = (end - start).toFixed(3);
    const timeTakenSec = (timeTakenMs / 1000).toFixed(3);
    console.log(`${label}: ${timeTakenMs} ms (${timeTakenSec} sec)`);
    return { value: parseFloat(timeTakenMs), unit: "ms", converted: `${timeTakenSec} sec` };
}

function formatBytes(bytes) {
    if (bytes < 1024) return { value: bytes, unit: "B" };
    if (bytes < 1024 * 1024) return { value: (bytes / 1024).toFixed(2), unit: "KB" };
    return { value: (bytes / (1024 * 1024)).toFixed(2), unit: "MB" };
}

async function benchmark() {
    console.log("[x] Running Post-Quantum Cryptography Benchmark...\n");

    const kyberVersions = {
        "ML-KEM512": ml_kem512,
        "ML-KEM768": ml_kem768,
        "ML-KEM1024": ml_kem1024
    };

    const dilithiumVersions = {
        "ML-DSA44": ml_dsa44,
        "ML-DSA65": ml_dsa65,
        "ML-DSA87": ml_dsa87
    };

    const sphincsVersions = {
        "SLH-DSA-128F": slh_dsa_sha2_128f,
        "SLH-DSA-192F": slh_dsa_sha2_192f,
        "SLH-DSA-256F": slh_dsa_sha2_256f,
    };

    const message = utf8ToBytes("hello noble");

    // === KYBER (ML-KEM) ===
    benchmarkResults["Kyber"] = {};
    for (const [name, kyber] of Object.entries(kyberVersions)) {
        console.log(`[x] Benchmarking ${name}...`);

        const seed = randomBytes(64);
        benchmarkResults["Kyber"][name] = {
            keyGenTime: measureTime(`${name} KeyGen`, () => kyber.keygen(seed), ITERATIONS),
        };

        const aliceKeys = kyber.keygen(seed);
        const { publicKey, secretKey } = aliceKeys;

        benchmarkResults["Kyber"][name].encapsulationTime = measureTime(
            `${name} Encapsulation`,
            () => kyber.encapsulate(publicKey),
            ITERATIONS
        );

        const { cipherText, sharedSecret: bobShared } = kyber.encapsulate(publicKey);

        benchmarkResults["Kyber"][name].decapsulationTime = measureTime(
            `${name} Decapsulation`,
            () => kyber.decapsulate(cipherText, secretKey),
            ITERATIONS
        );

        benchmarkResults["Kyber"][name].keySize = formatBytes(publicKey.length + secretKey.length);
        benchmarkResults["Kyber"][name].ciphertextSize = formatBytes(cipherText.length);
        benchmarkResults["Kyber"][name].sharedSecretSize = formatBytes(bobShared.length);
    }

    // === DILITHIUM (ML-DSA) ===
    benchmarkResults["Dilithium"] = {};
    for (const [name, dilithium] of Object.entries(dilithiumVersions)) {
        console.log(`[x] Benchmarking ${name}...`);

        const seed = randomBytes(32);
        benchmarkResults["Dilithium"][name] = {
            keyGenTime: measureTime(`${name} KeyGen`, () => dilithium.keygen(seed), ITERATIONS),
        };

        const keys = dilithium.keygen(seed);

        benchmarkResults["Dilithium"][name].signingTime = measureTime(
            `${name} Signing`,
            () => dilithium.sign(keys.secretKey, message),
            ITERATIONS
        );

        const signature = dilithium.sign(keys.secretKey, message);

        benchmarkResults["Dilithium"][name].verificationTime = measureTime(
            `${name} Verification`,
            () => dilithium.verify(keys.publicKey, message, signature),
            ITERATIONS
        );

        benchmarkResults["Dilithium"][name].keySize = formatBytes(keys.publicKey.length + keys.secretKey.length);
        benchmarkResults["Dilithium"][name].signatureSize = formatBytes(signature.length);
    }

    // === SPHINCS+ (SLH-DSA) ===
    benchmarkResults["SPHINCS+"] = {};
    for (const [name, sphincs] of Object.entries(sphincsVersions)) {
        console.log(`[x] Benchmarking ${name}...`);

        const sphincsSeedLengths = {
            "SLH-DSA-128F": 48,
            "SLH-DSA-192F": 72,
            "SLH-DSA-256F": 96,
        };

        const sphincsSeedLength = sphincsSeedLengths[name] || 48;
        const seed = randomBytes(sphincsSeedLength);

        benchmarkResults["SPHINCS+"][name] = {
            keyGenTime: measureTime(`${name} KeyGen`, () => sphincs.keygen(seed), SPHINCS_ITERATIONS),
        };

        const keys = sphincs.keygen(seed);

        benchmarkResults["SPHINCS+"][name].signingTime = measureTime(
            `${name} Signing`,
            () => sphincs.sign(keys.secretKey, message),
            SPHINCS_ITERATIONS
        );

        const signature = sphincs.sign(keys.secretKey, message);

        benchmarkResults["SPHINCS+"][name].verificationTime = measureTime(
            `${name} Verification`,
            () => sphincs.verify(keys.publicKey, message, signature),
            SPHINCS_ITERATIONS
        );

        benchmarkResults["SPHINCS+"][name].keySize = formatBytes(keys.publicKey.length + keys.secretKey.length);
        benchmarkResults["SPHINCS+"][name].signatureSize = formatBytes(signature.length);
    }

    console.log("\no7 Benchmark Completed.");

    fs.writeFileSync("../Results/benchmark_results(Pure Node).json", JSON.stringify(benchmarkResults, null, 4));
    console.log("\no7 Benchmark results saved to 'benchmark_results.json'");
}

benchmark();
