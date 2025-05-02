import { convertMsToMinutes } from "./utils/benchmarking.js";
import { createChart } from "./utils/chart-utils.js";
import { benchmarkKyber } from "./benchmarks/kyber.js";
import { benchmarkMLDilithium } from "./benchmarks/ml-dilithium.js";
import { benchmarkFalcon } from "./benchmarks/falcon.js";
import { benchmarkCrystalsDilithium } from "./benchmarks/crystals.js";
import { benchmarkSPHINCS } from "./benchmarks/sphincs.js";

let benchmarkResults = {};

async function runAllBenchmarks() {
  benchmarkResults = {};

  const kyberEnabled      = document.getElementById("checkbox_kyber").checked;
  const mlDilEnabled      = document.getElementById("checkbox_ml_dilithium").checked;
  const falconEnabled     = document.getElementById("checkbox_falcon").checked;
  const crystalsEnabled   = document.getElementById("checkbox_crystals").checked;
  const sphincsEnabled    = document.getElementById("checkbox_sphincs").checked;
  
  const iterKyber   = Number(document.getElementById("iterations_kyber").value) || 30000;
  const iterMLDil   = Number(document.getElementById("iterations_ml_dilithium").value) || 30000;
  const iterFalcon  = Number(document.getElementById("iterations_falcon").value) || 30000;
  const iterCrystals= Number(document.getElementById("iterations_crystals").value) || 30000;
  const iterSphincs = Number(document.getElementById("iterations_sphincs").value) || 30000;

  if (kyberEnabled)    await benchmarkKyber(iterKyber, benchmarkResults);
  if (mlDilEnabled)    await benchmarkMLDilithium(iterMLDil, benchmarkResults);
  if (falconEnabled)   await benchmarkFalcon(iterFalcon, benchmarkResults);
  if (crystalsEnabled) await benchmarkCrystalsDilithium(iterCrystals, benchmarkResults);
  if (sphincsEnabled)  await benchmarkSPHINCS(iterSphincs, benchmarkResults);

  document.getElementById("downloadBtn").style.display = "block";
  generateGraphs();
}

function generateGraphs() {
  // Kyber charts
  if (benchmarkResults.Kyber) {
    const kyberAlgos = Object.keys(benchmarkResults.Kyber);
    const kyberKeyGenData = kyberAlgos.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].keyGenTime.value));
    const kyberEncapData  = kyberAlgos.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].encapsulationTime.value));
    const kyberDecapData  = kyberAlgos.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].decapsulationTime.value));
    createChart("kyberTimeChart", { 
      type: "bar",
      data: {
        labels: kyberAlgos,
        datasets: [
          { label: "KeyGen (Minutes)",        data: kyberKeyGenData, backgroundColor: "rgba(54, 162, 235, 0.6)" },
          { label: "Encapsulation (Minutes)", data: kyberEncapData,  backgroundColor: "rgba(255, 99, 132, 0.6)" },
          { label: "Decapsulation (Minutes)", data: kyberDecapData,  backgroundColor: "rgba(75, 192, 192, 0.6)" }
        ]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    createChart("kyberSizeChart", { 
      type: "bar",
      data: {
        labels: kyberAlgos,
        datasets: [
          { label: "Key Size (Bytes)",        data: kyberAlgos.map(a => benchmarkResults.Kyber[a].keySize.value), backgroundColor: "rgba(75, 192, 192, 0.6)" },
          { label: "Ciphertext Size (Bytes)", data: kyberAlgos.map(a => benchmarkResults.Kyber[a].ciphertextSize.value), backgroundColor: "rgba(153, 102, 255, 0.6)" },
          { label: "Shared Secret (Bytes)",   data: kyberAlgos.map(a => benchmarkResults.Kyber[a].sharedSecretSize.value), backgroundColor: "rgba(255, 159, 64, 0.6)" }
        ]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    document.getElementById("kyberGraphs").style.display = "block";
  } else {
    document.getElementById("kyberGraphs").style.display = "none";
  }

  // ML-Dilithium charts
  if (benchmarkResults.MLDilithium) {
    const mldilAlgos = Object.keys(benchmarkResults.MLDilithium);
    const mldilKeyGenData = mldilAlgos.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].keyGenTime.value));
    const mldilSignData   = mldilAlgos.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].signingTime.value));
    const mldilVerifyData = mldilAlgos.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].verificationTime.value));
    createChart("mldilTimeChart", {
      type: "bar",
      data: {
        labels: mldilAlgos,
        datasets: [
          { label: "KeyGen (Minutes)",      data: mldilKeyGenData, backgroundColor: "rgba(54, 162, 235, 0.6)" },
          { label: "Signing (Minutes)",     data: mldilSignData,   backgroundColor: "rgba(255, 99, 132, 0.6)" },
          { label: "Verification (Minutes)",data: mldilVerifyData, backgroundColor: "rgba(75, 192, 192, 0.6)" }
        ]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    createChart("mldilSizeChart", {
      type: "bar",
      data: {
        labels: mldilAlgos,
        datasets: [
          { label: "Key Size (Bytes)",      data: mldilAlgos.map(a => benchmarkResults.MLDilithium[a].keySize.value), backgroundColor: "rgba(75, 192, 192, 0.6)" },
          { label: "Signature (Bytes)",     data: mldilAlgos.map(a => benchmarkResults.MLDilithium[a].signatureSize.value), backgroundColor: "rgba(153, 102, 255, 0.6)" }
        ]
      },
      options: { responsive: true, scales: { y: { beginAtZero: true } } }
    });
    document.getElementById("mldilGraphs").style.display = "block";
  } else {
    document.getElementById("mldilGraphs").style.display = "none";
  }

}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", runAllBenchmarks);
  document.getElementById("downloadBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(benchmarkResults, null, 4)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "combined_benchmark_results.json";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });
});
