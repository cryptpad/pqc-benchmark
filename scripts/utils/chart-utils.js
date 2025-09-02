// SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru
//
// SPDX-License-Identifier: AGPL-3.0-or-later

import { Chart, LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement, Legend, Title, Tooltip } from 'https://cdn.jsdelivr.net/npm/chart.js@4.4.9/+esm';
Chart.register(LinearScale, CategoryScale, BarController, BarElement, LineController, LineElement, PointElement, Legend, Title, Tooltip);

export const chartInstances = {};

export function createChart(canvasId, chartConfig) {
  if (chartInstances[canvasId]) {
    chartInstances[canvasId].destroy();
  }
  const ctx = document.getElementById(canvasId).getContext("2d");
  chartInstances[canvasId] = new Chart(ctx, chartConfig);
  return chartInstances[canvasId];
}
