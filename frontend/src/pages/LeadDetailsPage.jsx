import { useCallback, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { formatDateTime, titleCase } from '../utils/format'

const STATUSES = ['NEW', 'CONTACTED', 'WON', 'LOST']

function DetailItem({ label, children }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{children || 'Not provided'}</strong>
    </div>
  )
}

function LeadDetailsPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canManageLeads, isAgent } = useAuth()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)
  const [savingStatus, setSavingStatus] = useState(false)
  const [error, setError] = useState('')

  const loadLead = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const { data } = await api.get(`/leads/${id}`)
      setLead(data.data)
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load this lead.'))
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    // Data loading is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLead()
  }, [loadLead])

  const updateStatus = async (event) => {
    const status = event.target.value
    setSavingStatus(true)
    setError('')

    try {
      const { data } = await api.patch(`/leads/${id}/status`, { status })
      setLead((current) => ({ ...current, ...data.data }))
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not update lead status.'))
    } finally {
      setSavingStatus(false)
    }
  }

  const deleteLead = async () => {
    const confirmed = window.confirm(
      `Delete ${lead.name}? This action cannot be undone.`,
    )
    if (!confirmed) return

    try {
      await api.delete(`/leads/${id}`)
      navigate('/leads', { replace: true })
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not delete this lead.'))
    }
  }

  if (loading) return <LoadingState label="Loading lead details..." />

  if (!lead) {
    return (
      <div className="page">
        <ErrorAlert message={error || 'Lead not found.'} onRetry={loadLead} />
        <Link className="button secondary" to="/leads">
          Back to leads
        </Link>
      </div>
    )
  }

  return (
    <div className="page">
      <Link className="back-link" to="/leads">
        ← Back to leads
      </Link>

      <PageHeader
        eyebrow="Lead details"
        title={lead.name}
        description={`Added ${formatDateTime(lead.created_at)}`}
        actions={
          canManageLeads && (
            <>
              <Link className="button secondary" to={`/leads/${id}/edit`}>
                Edit lead
              </Link>
              <button className="button danger-ghost" onClick={deleteLead} type="button">
                Delete
              </button>
            </>
          )
        }
      />

      <ErrorAlert message={error} onRetry={loadLead} />

      <div className="details-layout">
        <section className="content-card details-card">
          <div className="card-heading">
            <div>
              <h2>Contact information</h2>
              <p>Primary details for this opportunity.</p>
            </div>
            <StatusBadge status={lead.status} />
          </div>

          <div className="details-grid">
            <DetailItem label="Email">
              <a href={`mailto:${lead.email}`}>{lead.email}</a>
            </DetailItem>
            <DetailItem label="Phone">
              <a href={`tel:${lead.phone}`}>{lead.phone}</a>
            </DetailItem>
            <DetailItem label="Source">{titleCase(lead.source)}</DetailItem>
            <DetailItem label="Assigned agent">
              {lead.assigned_agent || `Agent #${lead.assigned_to}`}
            </DetailItem>
          </div>

          <div className="notes-block">
            <span>Notes</span>
            <p>{lead.notes || 'No notes have been added for this lead.'}</p>
          </div>
        </section>

        <aside className="content-card side-card">
          <h2>Pipeline status</h2>
          <p>Keep this stage current after each interaction.</p>

          {isAgent ? (
            <div className="form-field">
              <label htmlFor="lead-status">Current status</label>
              <select
                id="lead-status"
                value={lead.status}
                onChange={updateStatus}
                disabled={savingStatus}
              >
                {STATUSES.map((status) => (
                  <option value={status} key={status}>
                    {titleCase(status)}
                  </option>
                ))}
              </select>
              {savingStatus && <small className="field-hint">Saving status...</small>}
            </div>
          ) : (
            <div className="status-summary">
              <StatusBadge status={lead.status} />
              <small>Managers can update this from the edit form.</small>
            </div>
          )}

          <div className="side-divider" />
          <DetailItem label="Lead ID">#{lead.id}</DetailItem>
          <DetailItem label="Last updated">
            {formatDateTime(lead.updated_at || lead.created_at)}
          </DetailItem>
        </aside>
      </div>
    </div>
  )
}

export default LeadDetailsPage
