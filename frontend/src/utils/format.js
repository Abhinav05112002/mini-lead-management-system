export function formatDate(value, options = {}) {
  if (!value) return 'Not available'

  return new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    ...options,
  }).format(new Date(value))
}

export function formatDateTime(value) {
  return formatDate(value, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function titleCase(value = '') {
  return value
    .toLowerCase()
    .split(/[_\s-]+/)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
