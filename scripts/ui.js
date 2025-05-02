import { createChart } from "./utils/chart-utils.js";
import { convertMsToMinutes } from "./utils/benchmarking.js";
import { benchmarkKyber } from "./benchmarks/kyber.js";
import { benchmarkMLDilithium } from "./benchmarks/ml-dilithium.js";
import { benchmarkFalcon } from "./benchmarks/falcon.js";
import { benchmarkCrystalsDilithium } from "./benchmarks/crystals.js";
import { benchmarkSPHINCS } from "./benchmarks/sphincs.js";

let benchmarkResults = {};

export async function runAllBenchmarks() {
  benchmarkResults = {};
  // Get benchmark options from the DOM
  const kyberEnabled     = document.getElementById("checkbox_kyber").checked;
  const mlDilEnabled     = document.getElementById("checkbox_ml_dilithium").checked;
  const falconEnabled    = document.getElementById("checkbox_falcon").checked;
  const crystalsEnabled  = document.getElementById("checkbox_crystals").checked;
  const sphincsEnabled   = document.getElementById("checkbox_sphincs").checked;

  const iterKyber      = Number(document.getElementById("iterations_kyber").value) || 30000;
  const iterMLDil      = Number(document.getElementById("iterations_ml_dilithium").value) || 30000;
  const iterFalcon     = Number(document.getElementById("iterations_falcon").value) || 30000;
  const iterCrystals   = Number(document.getElementById("iterations_crystals").value) || 30000;
  const iterSphincs    = Number(document.getElementById("iterations_sphincs").value) || 30000;

  if (kyberEnabled)    await benchmarkKyber(iterKyber, benchmarkResults);
  if (mlDilEnabled)    await benchmarkMLDilithium(iterMLDil, benchmarkResults);
  if (falconEnabled)   await benchmarkFalcon(iterFalcon, benchmarkResults);
  if (crystalsEnabled) await benchmarkCrystalsDilithium(iterCrystals, benchmarkResults);
  if (sphincsEnabled)  await benchmarkSPHINCS(iterSphincs, benchmarkResults);

  document.getElementById("downloadBtn").style.display = "block";
  generateGraphs();
}

function generateGraphs() {
  generateKyberChart();
  generateMLDilithiumChart();
  generateFalconChart();
  generateCrystalsChart();
  generateSPHINCSChart();
}

function generateKyberChart() {
  if (!benchmarkResults.Kyber) {
    document.getElementById("kyberGraphs").style.display = "none";
    return;
  }
  const algoNames = Object.keys(benchmarkResults.Kyber);
  const keyGenTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].keyGenTime.value));
  const encapsulationTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].encapsulationTime.value));
  const decapsulationTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.Kyber[a].decapsulationTime.value));
  createChart("kyberTimeChart", {
    type: "bar",
    data: {
      labels: algoNames,
      datasets: [
        { label: "KeyGen Time (min)", data: keyGenTimes, backgroundColor: "rgba(54, 162, 235, 0.6)", yAxisID: "y" },
        { label: "Encapsulation Time (min)", data: encapsulationTimes, backgroundColor: "rgba(255, 99, 132, 0.6)", yAxisID: "y" },
        { label: "Decapsulation Time (min)", data: decapsulationTimes, backgroundColor: "rgba(75, 192, 192, 0.6)", yAxisID: "y" },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Time (min)" } },
      }
    }
  });
  document.getElementById("kyberGraphs").style.display = "block";
}

function generateMLDilithiumChart() {
  if (!benchmarkResults.MLDilithium) {
    document.getElementById("mldilGraphs").style.display = "none";
    return;
  }
  const algoNames = Object.keys(benchmarkResults.MLDilithium);
  const keyGenTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].keyGenTime.value));
  const signingTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].signingTime.value));
  const verificationTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults.MLDilithium[a].verificationTime.value));
  createChart("mldilTimeChart", {
    type: "bar",
    data: {
      labels: algoNames,
      datasets: [
        { label: "KeyGen Time (min)", data: keyGenTimes, backgroundColor: "rgba(54, 162, 235, 0.6)", yAxisID: "y" },
        { label: "Signing Time (min)", data: signingTimes, backgroundColor: "rgba(255, 99, 132, 0.6)", yAxisID: "y" },
        { label: "Verification Time (min)", data: verificationTimes, backgroundColor: "rgba(75, 192, 192, 0.6)", yAxisID: "y" },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Time (min)" } },
      }
    }
  });
  document.getElementById("mldilGraphs").style.display = "block";
}

function generateFalconChart() {
  if (!benchmarkResults.Falcon) {
    document.getElementById("falconGraphs").style.display = "none";
    return;
  }
  const algoNames = ["Falcon"];
  const keyGenTimes = [convertMsToMinutes(benchmarkResults.Falcon.keyGenTime.value)];
  const signTimes = [convertMsToMinutes(benchmarkResults.Falcon.signTime.value)];
  const openTimes = [convertMsToMinutes(benchmarkResults.Falcon.openTime.value)];
  const signDetachedTimes = [convertMsToMinutes(benchmarkResults.Falcon.signDetachedTime.value)];
  const verifyDetachedTimes = [convertMsToMinutes(benchmarkResults.Falcon.verifyDetachedTime.value)];
  createChart("falconTimeChart", {
    type: "bar",
    data: {
      labels: algoNames,
      datasets: [
        { label: "KeyGen Time (min)", data: keyGenTimes, backgroundColor: "rgba(54, 162, 235, 0.6)", yAxisID: "y" },
        { label: "Sign Time (min)", data: signTimes, backgroundColor: "rgba(255, 99, 132, 0.6)", yAxisID: "y" },
        { label: "Open Time (min)", data: openTimes, backgroundColor: "rgba(75, 192, 192, 0.6)", yAxisID: "y" },
        { label: "Sign Detached (min)", data: signDetachedTimes, backgroundColor: "rgba(153, 102, 255, 0.6)", yAxisID: "y" },
        { label: "Verify Detached (min)", data: verifyDetachedTimes, backgroundColor: "rgba(255, 159, 64, 0.6)", yAxisID: "y" },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Time (min)" } },
      }
    }
  });
  document.getElementById("falconGraphs").style.display = "block";
}


function generateCrystalsChart() {
  if (!benchmarkResults.CrystalsDilithium) {
    document.getElementById("crystalsGraphs").style.display = "none";
    return;
  }
  const algoNames = ["Crystals Dilithium"];
  const keyGenTimes = [convertMsToMinutes(benchmarkResults.CrystalsDilithium.keyGenTime.value)];
  const signTimes = [convertMsToMinutes(benchmarkResults.CrystalsDilithium.signTime.value)];
  const openTimes = [convertMsToMinutes(benchmarkResults.CrystalsDilithium.openTime.value)];
  const signDetachedTimes = [convertMsToMinutes(benchmarkResults.CrystalsDilithium.signDetachedTime.value)];
  const verifyDetachedTimes = [convertMsToMinutes(benchmarkResults.CrystalsDilithium.verifyDetachedTime.value)];
  createChart("crystalsTimeChart", {
    type: "bar",
    data: {
      labels: algoNames,
      datasets: [
        { label: "KeyGen Time (min)", data: keyGenTimes, backgroundColor: "rgba(54, 162, 235, 0.6)", yAxisID: "y" },
        { label: "Sign Time (min)", data: signTimes, backgroundColor: "rgba(255, 99, 132, 0.6)", yAxisID: "y" },
        { label: "Open Time (min)", data: openTimes, backgroundColor: "rgba(75, 192, 192, 0.6)", yAxisID: "y" },
        { label: "Sign Detached (min)", data: signDetachedTimes, backgroundColor: "rgba(153, 102, 255, 0.6)", yAxisID: "y" },
        { label: "Verify Detached (min)", data: verifyDetachedTimes, backgroundColor: "rgba(255, 159, 64, 0.6)", yAxisID: "y" },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Time (min)" } },
      }
    }
  });
  document.getElementById("crystalsGraphs").style.display = "block";
}

function generateSPHINCSChart() {
  if (!benchmarkResults["SPHINCS+"]) {
    document.getElementById("sphincsGraphs").style.display = "none";
    return;
  }
  const algoNames = Object.keys(benchmarkResults["SPHINCS+"]);
  const keyGenTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults["SPHINCS+"][a].keyGenTime.value));
  const signingTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults["SPHINCS+"][a].signingTime.value));
  const verificationTimes = algoNames.map(a => convertMsToMinutes(benchmarkResults["SPHINCS+"][a].verificationTime.value));
  createChart("sphincsTimeChart", {
    type: "bar",
    data: {
      labels: algoNames,
      datasets: [
        { label: "KeyGen Time (min)", data: keyGenTimes, backgroundColor: "rgba(54, 162, 235, 0.6)", yAxisID: "y" },
        { label: "Signing Time (min)", data: signingTimes, backgroundColor: "rgba(255, 99, 132, 0.6)", yAxisID: "y" },
        { label: "Verification Time (min)", data: verificationTimes, backgroundColor: "rgba(75, 192, 192, 0.6)", yAxisID: "y" },
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "Time (min)" } },
      }
    }
  });
  document.getElementById("sphincsGraphs").style.display = "block";
}

export function setupUI() {
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
}
