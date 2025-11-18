/**
 * Format number with thousands separator
 */
export function formatNumber(num) {
  return new Intl.NumberFormat("es-CO").format(num);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value, total) {
  if (total === 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}

/**
 * Get status color based on performance
 */
export function getStatusColor(percentage) {
  if (percentage >= 90) return "green";
  if (percentage >= 70) return "yellow";
  return "red";
}

/**
 * Get evaluation label based on performance
 */
export function getEvaluationLabel(percentage) {
  if (percentage >= 90) return "Avance Alto";
  if (percentage >= 70) return "Avance Medio";
  return "Avance Bajo";
}
