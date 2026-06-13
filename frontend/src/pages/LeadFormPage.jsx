import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate, useParams } from 'react-router-dom'
import api, { getApiError } from '../api/client'
import ErrorAlert from '../components/ErrorAlert'
import LoadingState from '../components/LoadingState'
import PageHeader from '../components/PageHeader'

const SOURCES = ['WEBSITE', 'REFERRAL', 'SOCIAL_MEDIA', 'EMAIL', 'OTHER']
const STATUSES = ['NEW', 'CONTACTED', 'WON', 'LOST']

function LeadFormPage() {
  const { id } = useParams()
  const isEditing = Boolean(id)
  const [loading, setLoading] = useState(isEditing)
  const [apiError, setApiError] = useState('')
  const navigate = useNavigate()
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      source: 'WEBSITE',
      status: 'NEW',
      notes: '',
    },
  })

  useEffect(() => {
    if (!isEditing) return

    const loadLead = async () => {
      try {
        const { data } = await api.get(`/leads/${id}`)
        const lead = data.data
        reset({
          name: lead.name || '',
          email: lead.email || '',
          phone: lead.phone || '',
          source: lead.source || 'WEBSITE',
          status: lead.status || 'NEW',
          notes: lead.notes || '',
        })
      } catch (error) {
        setApiError(getApiError(error, 'Could not load this lead.'))
      } finally {
        setLoading(false)
      }
    }

    loadLead()
  }, [id, isEditing, reset])

  const onSubmit = async (values) => {
    setApiError('')

    try {
      const response = isEditing
        ? await api.put(`/leads/${id}`, values)
        : await api.post('/leads', values)
      navigate(`/leads/${response.data.data.id}`)
    } catch (error) {
      setApiError(getApiError(error, `Could not ${isEditing ? 'update' : 'create'} lead.`))
    }
  }

  if (loading) return <LoadingState label="Loading lead..." />

  return (
    <div className="page narrow-page">
      <PageHeader
        eyebrow="Lead management"
        title={isEditing ? 'Edit lead' : 'Create a new lead'}
        description={
          isEditing
            ? 'Update the contact and pipeline information below.'
            : 'Add a qualified opportunity. It will be assigned automatically.'
        }
      />

      <ErrorAlert message={apiError} />

      <form className="content-card lead-form" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="form-section-heading">
          <span>1</span>
          <div>
            <h2>Contact details</h2>
            <p>Basic information used to identify and contact the lead.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field full-span">
            <label htmlFor="name">Full name</label>
            <input
              id="name"
              placeholder="e.g. Ananya Sharma"
              className={errors.name ? 'invalid' : ''}
              {...register('name', { required: 'Name is required.' })}
            />
            {errors.name && <small className="field-error">{errors.name.message}</small>}
          </div>

          <div className="form-field">
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="ananya@company.com"
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
            <label htmlFor="phone">Phone number</label>
            <input
              id="phone"
              type="tel"
              placeholder="+91 98765 43210"
              className={errors.phone ? 'invalid' : ''}
              {...register('phone', {
                required: 'Phone number is required.',
                minLength: { value: 7, message: 'Enter a valid phone number.' },
              })}
            />
            {errors.phone && <small className="field-error">{errors.phone.message}</small>}
          </div>
        </div>

        <div className="form-divider" />

        <div className="form-section-heading">
          <span>2</span>
          <div>
            <h2>Pipeline details</h2>
            <p>Capture where the opportunity came from and its current stage.</p>
          </div>
        </div>

        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="source">Lead source</label>
            <select id="source" {...register('source', { required: true })}>
              {SOURCES.map((source) => (
                <option value={source} key={source}>
                  {source.replaceAll('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {isEditing && (
            <div className="form-field">
              <label htmlFor="status">Status</label>
              <select id="status" {...register('status')}>
                {STATUSES.map((status) => (
                  <option value={status} key={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="form-field full-span">
            <label htmlFor="notes">Notes</label>
            <textarea
              id="notes"
              rows="5"
              placeholder="Add context, requirements, or the next action..."
              {...register('notes', { maxLength: 1000 })}
            />
            <small className="field-hint">Optional, up to 1,000 characters.</small>
          </div>
        </div>

        <div className="form-actions">
          <Link className="button secondary" to={isEditing ? `/leads/${id}` : '/leads'}>
            Cancel
          </Link>
          <button className="button primary" disabled={isSubmitting} type="submit">
            {isSubmitting
              ? 'Saving...'
              : isEditing
                ? 'Save changes'
                : 'Create and assign lead'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default LeadFormPage
