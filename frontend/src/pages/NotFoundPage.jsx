import { Link } from 'react-router-dom'

function NotFoundPage() {
  return (
    <main className="not-found">
      <p className="eyebrow">404</p>
      <h1>That page does not exist.</h1>
      <p>The link may be outdated, or the page may have moved.</p>
      <Link className="button primary" to="/dashboard">
        Return to dashboard
      </Link>
    </main>
  )
}

export default NotFoundPage
