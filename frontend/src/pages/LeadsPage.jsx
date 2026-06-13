import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'
import StatusBadge from '../components/StatusBadge'
import { useAuth } from '../context/AuthContext'
import { formatDate, titleCase } from '../utils/format'

const PAGE_SIZE = 10
const STATUSES = ['', 'NEW', 'CONTACTED', 'WON', 'LOST']
const SOURCES = ['', 'WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL', 'OTHER']

function LeadsPage() {
  const [leads, setLeads] = useState([])
  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const [filters, setFilters] = useState({
    search: '',
    status: '',
    source: '',
    sort: 'created_at',
    order: 'DESC',
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const { canManageLeads, isAgent } = useAuth()

  const loadLeads = useCallback(async () => {
    setLoading(true)
    setError('')

    try {
      if (isAgent) {
        const { data } = await api.get('/leads/my-leads')
        const search = filters.search.toLowerCase()
        const filtered = data.data
          .filter(
            (lead) =>
              !search ||
              [lead.name, lead.email, lead.phone].some((value) =>
                value?.toLowerCase().includes(search),
              ),
          )
          .filter((lead) => !filters.status || lead.status === filters.status)
          .filter((lead) => !filters.source || lead.source === filters.source)

        const start = (page - 1) * PAGE_SIZE
        setLeads(filtered.slice(start, start + PAGE_SIZE))
        return
      }

      const { data } = await api.get('/leads', {
        params: {
          ...filters,
          page,
          limit: PAGE_SIZE,
          status: filters.status || undefined,
          source: filters.source || undefined,
        },
      })
      setLeads(data.data)
    } catch (requestError) {
      setError(getApiError(requestError, 'Could not load leads.'))
    } finally {
      setLoading(false)
    }
  }, [filters, isAgent, page])

  useEffect(() => {
    // Data loading is the external synchronization performed by this effect.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadLeads()
  }, [loadLeads])

  const updateFilter = (event) => {
    const { name, value } = event.target
    setPage(1)
    setFilters((current) => ({ ...current, [name]: value }))
  }

  const submitSearch = (event) => {
    event.preventDefault()
    setPage(1)
    setFilters((current) => ({ ...current, search: searchInput.trim() }))
  }

  return (
    <div className="page">
      <PageHeader
        eyebrow="Pipeline"
        title={isAgent ? 'My leads' : 'Leads'}
        description={
          isAgent
            ? 'Review your assigned leads and keep their status current.'
            : 'Search, filter, and manage every opportunity in one place.'
        }
        actions={
          canManageLeads && (
            <Link className="button primary" to="/leads/new">
              <span>+</span> Add lead
            </Link>
          )
        }
      />

      <section className="content-card">
        <div className="filters">
          <form className="search-box" onSubmit={submitSearch}>
            <span aria-hidden="true">⌕</span>
            <input
              aria-label="Search leads"
              placeholder="Search name, email, or phone"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
            />
            <button type="submit">Search</button>
          </form>

          <div className="filter-selects">
            <select
              aria-label="Filter by status"
              name="status"
              value={filters.status}
              onChange={updateFilter}
            >
              {STATUSES.map((status) => (
                <option value={status} key={status || 'all'}>
                  {status ? titleCase(status) : 'All statuses'}
                </option>
              ))}
            </select>
            <select
              aria-label="Filter by source"
              name="source"
              value={filters.source}
              onChange={updateFilter}
            >
              {SOURCES.map((source) => (
                <option value={source} key={source || 'all'}>
                  {source ? titleCase(source) : 'All sources'}
                </option>
              ))}
            </select>
            {!isAgent && (
              <select
                aria-label="Sort leads"
                name="sort"
                value={filters.sort}
                onChange={updateFilter}
              >
                <option value="created_at">Date created</option>
                <option value="name">Name</option>
                <option value="status">Status</option>
                <option value="source">Source</option>
              </select>
            )}
          </div>
        </div>

        <ErrorAlert message={error} onRetry={loadLeads} />

        {loading ? (
          <LoadingState label="Loading leads..." />
        ) : leads.length ? (
          <>
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Lead</th>
                    <th>Phone</th>
                    <th>Source</th>
                    <th>Status</th>
                    <th>Created</th>
                    <th aria-label="Actions" />
                  </tr>
                </thead>
                <tbody>
                  {leads.map((lead) => (
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
                      <td>{lead.phone}</td>
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

            <div className="pagination">
              <p>
                Page <strong>{page}</strong>
              </p>
              <div>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setPage((current) => current - 1)}
                  disabled={page === 1}
                >
                  Previous
                </button>
                <button
                  type="button"
                  className="button secondary"
                  onClick={() => setPage((current) => current + 1)}
                  disabled={leads.length < PAGE_SIZE}
                >
                  Next
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="empty-state">
            <span>⌕</span>
            <h3>No leads found</h3>
            <p>Try changing the search or filters to see more results.</p>
          </div>
        )}
      </section>
    </div>
  )
}

export default LeadsPage
