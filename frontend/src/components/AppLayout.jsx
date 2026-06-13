import { useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const Icon = ({ children }) => (
  <span className="nav-icon" aria-hidden="true">
    {children}
  </span>
)

function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, logout, canManageLeads } = useAuth()
  const initials = user.name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="app-shell">
      <button
        className={`sidebar-backdrop ${menuOpen ? 'show' : ''}`}
        onClick={closeMenu}
        aria-label="Close navigation"
        type="button"
      />

      <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">L</span>
          <span>LeadFlow</span>
        </div>

        <nav className="sidebar-nav" aria-label="Main navigation">
          <p className="nav-label">Workspace</p>
          <NavLink to="/dashboard" onClick={closeMenu}>
            <Icon>⌂</Icon>
            Dashboard
          </NavLink>
          <NavLink to="/leads" onClick={closeMenu}>
            <Icon>◎</Icon>
            Leads
          </NavLink>
          {canManageLeads && (
            <NavLink to="/activity" onClick={closeMenu}>
              <Icon>↻</Icon>
              Activity
            </NavLink>
          )}
        </nav>

        <div className="sidebar-footer">
          <div className="user-card">
            <span className="avatar">{initials}</span>
            <span className="user-copy">
              <strong>{user.name}</strong>
              <small>{user.role.toLowerCase()}</small>
            </span>
          </div>
          <button className="logout-button" onClick={logout} type="button">
            Sign out
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="mobile-header">
          <button
            type="button"
            className="menu-button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div className="brand compact">
            <span className="brand-mark">L</span>
            <span>LeadFlow</span>
          </div>
          <span className="avatar small">{initials}</span>
        </header>
        <Outlet />
      </main>
    </div>
  )
}

export default AppLayout
