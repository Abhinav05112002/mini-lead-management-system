import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { formatDate, titleCase } from '../utils/format'

const STAT_CONFIG = [
  { key: 'total', label: 'Total leads', className: 'purple', icon: '◎' },
  { key: 'new_leads', label: 'New leads', className: 'blue', icon: '+' },
  { key: 'contacted', label: 'Contacted', className: 'amber', icon: '↗' },
  { key: 'won', label: 'Won', className: 'green', icon: '✓' },
]

function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentLeads, setRecentLeads] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { user, canManageLeads, isAgent } = useAuth()

  const loadDashboard = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      const leadsUrl = isAgent ? '/leads/my-leads' : '/leads'
      const [statsResponse, leadsResponse] = await Promise.all([
        api.get('/dashboard/stats'),
        api.get(leadsUrl, {
          params: isAgent ? undefined : { limit: 5, sort: 'created_at', order: 'DESC' },
        }),
      ])

      setStats(statsResponse.data.data)
      setRecentLeads(leadsResponse.data.data.slice(0, 5))
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load dashboard data.'))
    } finally {
      setLoading(false)
    }
  }, [isAgent])

  useEffect(() => {
    // Data loading is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard()
  }, [loadDashboard])

  if (loading) return <LoadingState label="Preparing your dashboard..." />

  return (
    <div className="page">
      <PageHeader
        eyebrow="Overview"
        title={`Good to see you, ${user.name.split(' ')[0]}`}
        description="Here is the latest view of your lead pipeline."
        actions={
          canManageLeads && (
            <Link className="button primary" to="/leads/new">
              <span>+</span> Add lead
            </Link>
          )
        }
      />

      <ErrorAlert message={error} onRetry={loadDashboard} />

      <section className="stats-grid" aria-label="Lead statistics">
        {STAT_CONFIG.map((item) => (
          <article className="stat-card" key={item.key}>
            <div className={`stat-icon ${item.className}`}>{item.icon}</div>
            <div>
              <p>{item.label}</p>
              <strong>{Number(stats?.[item.key] || 0).toLocaleString()}</strong>
            </div>
          </article>
        ))}
      </section>

      <section className="content-card">
        <div className="card-heading">
          <div>
            <h2>{isAgent ? 'Your recent leads' : 'Recent leads'}</h2>
            <p>The newest opportunities added to the pipeline.</p>
          </div>
          <Link className="text-link" to="/leads">
            View all <span>→</span>
          </Link>
        </div>

        {recentLeads.length ? (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Source</th>
                  <th>Status</th>
                  <th>Created</th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td>
                      <div className="lead-cell">
                        <span className="lead-avatar">{lead.name?.charAt(0).toUpperCase()}</span>
                        <span>
                          <strong>{lead.name}</strong>
                          <small>{lead.email}</small>
                        </span>
                      </div>
                    </td>
                    <td>{titleCase(lead.source)}</td>
                    <td>
                      <StatusBadge status={lead.status} />
                    </td>
                    <td>{formatDate(lead.created_at)}</td>
                    <td>
                      <Link className="row-link" to={`/leads/${lead.id}`}>
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state compact">
            <h3>No leads yet</h3>
            <p>New opportunities will appear here when they are created.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
