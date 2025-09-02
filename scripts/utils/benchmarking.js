// SPDX-FileCopyrightText: 2025 XWiki CryptPad Team <contact@cryptpad.org> and Iulian-Tudor Scutaru
//
// SPDX-License-Identifier: AGPL-3.0-or-later

export function convertMsToMinutes(ms) {
  return ms / 60000;
}
export function convertMsToSeconds(ms) {
  return ms / 1000;
}
export function formatSecondsString(seconds) {
  return seconds.toFixed(3) + " sec";
}
export function formatBytes(bytes) {
  return { value: bytes, unit: "B" };
}
export async function measureTime(fn, iterations, timeConverter = ms => ms) {
  const start = performance.now();
  for (let i = 0; i < iterations; i++) await fn();
  const end = performance.now();
  const ms = end - start;
  return { value: parseFloat(ms.toFixed(3)), unit: "ms", converted: timeConverter(ms) };
}

