import Chart from 'https://cdn.jsdelivr.net/npm/chart.js';
export const chartInstances = {};

export function createChart(canvasId, chartConfig) {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }
  const ctx = document.getElementById(canvasId).getContext("2d");
  chartInstances[canvasId] = new Chart(ctx, chartConfig);
  return chartInstances[canvasId];
}
