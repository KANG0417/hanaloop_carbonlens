export const formatNumber = (value: number, decimals = 1): string =>
  value.toLocaleString('ko-KR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

export const formatEmission = (value: number): string => formatNumber(value, 1);

export const formatTons = (kgCo2e: number): string =>
  `${formatNumber(kgCo2e / 1000, 2)} tCO₂e`;
