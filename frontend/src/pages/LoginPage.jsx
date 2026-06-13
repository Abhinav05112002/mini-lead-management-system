import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiError } from '../api/client'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const [apiError, setApiError] = useState('')
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm()

  const onSubmit = async (values) => {
    setApiError('')

    try {
      await login(values)
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true })
    } catch (error) {
      setApiError(getApiError(error, 'Unable to sign in with those credentials.'))
    }
  }

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-brand">
          <span className="brand-mark">L</span>
          <span>LeadFlow</span>
        </div>
        <div className="auth-message">
          <span className="auth-kicker">Lead management, simplified</span>
          <h1>Turn every conversation into an opportunity.</h1>
          <p>
            Keep your team aligned, your pipeline visible, and every lead moving
            forward.
          </p>
        </div>
        <div className="auth-proof">
          <div className="proof-avatars" aria-hidden="true">
            <span>AK</span>
            <span>MP</span>
            <span>RS</span>
          </div>
          <p>
            <strong>Built for focused sales teams</strong>
            <span>One clear workspace from first touch to close.</span>
          </p>
        </div>
      </section>

      <section className="auth-panel">
        <div className="login-card">
          <p className="eyebrow">Welcome back</p>
          <h2>Sign in to your workspace</h2>
          <p className="form-intro">Enter your account details to continue.</p>

          {apiError && <div className="error-alert">{apiError}</div>}

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="form-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                type="email"
                placeholder="you@company.com"
                autoComplete="email"
                className={errors.email ? 'invalid' : ''}
                {...register('email', {
                  required: 'Email is required.',
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Enter a valid email address.',
                  },
                })}
              />
              {errors.email && <small className="field-error">{errors.email.message}</small>}
            </div>

            <div className="form-field">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                className={errors.password ? 'invalid' : ''}
                {...register('password', {
                  required: 'Password is required.',
                })}
              />
              {errors.password && (
                <small className="field-error">{errors.password.message}</small>
              )}
            </div>

            <button className="button primary full-width" disabled={isSubmitting} type="submit">
              {isSubmitting ? <span className="button-spinner" /> : 'Sign in'}
            </button>
          </form>

          <p className="login-note">
            Need an account? Ask your administrator to create one through the
            registration API.
          </p>
        </div>
      </section>
    </main>
  )
}

export default LoginPage
