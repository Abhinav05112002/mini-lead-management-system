const STATUS_LABELS = {
  NEW: 'New',
  CONTACTED: 'Contacted',
  WON: 'Won',
  LOST: 'Lost',
}

function StatusBadge({ status }) {
  const normalized = status || 'NEW'
  return (
    <span className={`status-badge status-${normalized.toLowerCase()}`}>
      <span aria-hidden="true" />
      {STATUS_LABELS[normalized] || normalized}
    </span>
  )
}

export default StatusBadge
