export function formatCurrency(value: number, compact = false): string {
  if (compact && value >= 1_000_000) {
    return `£${(value / 1_000_000).toFixed(1)}m`;
  }
  if (compact && value >= 1_000) {
    return `£${(value / 1_000).toFixed(0)}k`;
  }
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency: 'GBP',
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatNumber(value: number, decimals = 0): string {
  return value.toLocaleString('en-GB', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatMultiplier(value: number): string {
  return `${value.toFixed(1)}x`;
}

export function formatScore(value: number): string {
  return `${Math.round(value)}/100`;
}
