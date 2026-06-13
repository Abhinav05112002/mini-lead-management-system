function ErrorAlert({ message, onRetry }) {
  if (!message) return null

  return (
    <div className="error-alert" role="alert">
      <span>{message}</span>
      {onRetry && (
        <button type="button" onClick={onRetry}>
          Try again
        </button>
      )}
    </div>
  )
}

export default ErrorAlert
