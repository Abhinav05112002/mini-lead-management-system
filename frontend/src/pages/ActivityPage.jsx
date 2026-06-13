import { useCallback, useEffect, useState } from 'react'
import api, { getApiError } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import { formatDateTime, titleCase } from '../utils/format'

function ActivityPage() {
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadLogs = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get('/activity')
      setLogs(data.data)
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load activity history.'))
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    // Data loading is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLogs()
  }, [loadLogs])

  return (
    <div className="page narrow-page">
      <PageHeader
        eyebrow="Audit trail"
        title="Activity"
        description="A chronological record of important changes across the pipeline."
      />

      <ErrorAlert message={error} onRetry={loadLogs} />

      <section className="content-card activity-card">
        {loading ? (
          <LoadingState label="Loading activity..." />
        ) : logs.length ? (
          <div className="timeline">
            {logs.map((log) => (
              <article className="timeline-item" key={log.id}>
                <span className={`timeline-icon action-${log.action?.toLowerCase()}`}>↻</span>
                <div>
                  <div className="timeline-heading">
                    <h3>{titleCase(log.action)}</h3>
                    <time>{formatDateTime(log.created_at)}</time>
                  </div>
                  <p>{log.description}</p>
                  <small>
                    {log.user_name || `User #${log.performed_by}`}
                    {log.lead_name && ` · ${log.lead_name}`}
                  </small>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <h3>No activity recorded</h3>
            <p>Lead changes will appear here as your team works.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default ActivityPage
