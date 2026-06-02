'use client'

import React, { useState } from 'react'

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'pl', label: 'Polski' },
  { code: 'de', label: 'Deutsch' },
  { code: 'es', label: 'Español' },
  { code: 'fr', label: 'Français' },
  { code: 'it', label: 'Italiano' },
  { code: 'nl', label: 'Nederlands' },
  { code: 'ru', label: 'Русский' },
  { code: 'uk', label: 'Українська' },
]

type DryRunResult = {
  dryRun: true
  recipients: { email: string; locale: string; id: string }[]
  pageTotal: number
  total: number
  page: number
}

type SendResult = {
  sent: number
  sentTotal: number
  remaining: number
  status: string
  error?: string
}

type Props = {
  doc?: {
    id?: string
    status?: string
    sentCount?: number
    currentPage?: number
    name?: string
  }
}

export default function SendView({ doc }: Props) {
  const campaignId = doc?.id
  const status = doc?.status ?? 'draft'
  const sentCount = doc?.sentCount ?? 0
  const currentPage = doc?.currentPage ?? 1

  const [confirmed, setConfirmed] = useState<'confirmed' | 'unconfirmed' | 'all'>('confirmed')
  const [selectedLocales, setSelectedLocales] = useState<string[]>(['en', 'pl'])
  const [batchSize, setBatchSize] = useState(90)
  const [loading, setLoading] = useState(false)
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null)
  const [sendResult, setSendResult] = useState<SendResult | null>(null)
  const [showConfirm, setShowConfirm] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleLocale = (code: string) => {
    setSelectedLocales((prev) =>
      prev.includes(code) ? prev.filter((l) => l !== code) : [...prev, code],
    )
    setDryRunResult(null)
  }

  const callSend = async (dryRun: boolean) => {
    if (!campaignId) return
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/marketing/send', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ campaignId, dryRun, batchSize, filter: { confirmed, locales: selectedLocales } }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? `Error ${res.status}`)
        return
      }
      if (dryRun) {
        setDryRunResult(data)
      } else {
        setSendResult(data)
        setShowConfirm(false)
        setDryRunResult(null)
      }
    } catch (e: any) {
      setError(e?.message ?? 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const statusColor: Record<string, string> = {
    draft: '#888',
    sending: '#f59e0b',
    paused: '#3b82f6',
    completed: '#22c55e',
  }

  if (!campaignId) {
    return <div style={{ padding: 32 }}>Save the campaign first before sending.</div>
  }

  if (status === 'completed') {
    return (
      <div style={{ padding: 32 }}>
        <h2 style={{ marginBottom: 8 }}>Campaign Completed</h2>
        <p style={{ color: '#555' }}>
          {sentCount} emails sent. To send again, duplicate this campaign.
        </p>
      </div>
    )
  }

  return (
    <div style={{ padding: 32, maxWidth: 640, fontFamily: 'Arial, sans-serif' }}>
      <div style={{ marginBottom: 24 }}>
        <span
          style={{
            display: 'inline-block',
            padding: '3px 10px',
            borderRadius: 4,
            fontSize: 12,
            fontWeight: 600,
            textTransform: 'uppercase',
            background: statusColor[status] ?? '#888',
            color: '#fff',
            marginRight: 12,
          }}
        >
          {status}
        </span>
        {sentCount > 0 && (
          <span style={{ color: '#555', fontSize: 14 }}>{sentCount} emails sent so far (resuming from page {currentPage})</span>
        )}
      </div>

      <h2 style={{ marginBottom: 20 }}>Send Campaign</h2>

      {/* Filter: confirmed */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Subscribers</label>
        {(['confirmed', 'unconfirmed', 'all'] as const).map((opt) => (
          <label key={opt} style={{ marginRight: 16, cursor: 'pointer' }}>
            <input
              type="radio"
              name="confirmed"
              value={opt}
              checked={confirmed === opt}
              onChange={() => { setConfirmed(opt); setDryRunResult(null) }}
              style={{ marginRight: 4 }}
            />
            {opt === 'confirmed' ? 'Confirmed only' : opt === 'unconfirmed' ? 'Unconfirmed only' : 'All'}
          </label>
        ))}
      </div>

      {/* Filter: locales */}
      <div style={{ marginBottom: 16 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>Locales</label>
        {LOCALES.map((l) => (
          <label key={l.code} style={{ marginRight: 16, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={selectedLocales.includes(l.code)}
              onChange={() => toggleLocale(l.code)}
              style={{ marginRight: 4 }}
            />
            {l.code.toUpperCase()} – {l.label}
          </label>
        ))}
      </div>

      {/* Batch size */}
      <div style={{ marginBottom: 20 }}>
        <label style={{ display: 'block', fontWeight: 600, marginBottom: 6 }}>
          Batch size (max 90)
        </label>
        <input
          type="number"
          min={1}
          max={90}
          value={batchSize}
          onChange={(e) => { setBatchSize(Math.min(90, Math.max(1, Number(e.target.value)))); setDryRunResult(null) }}
          style={{ width: 80, padding: '4px 8px', border: '1px solid #ccc', borderRadius: 4 }}
        />
      </div>

      {/* Error */}
      {error && (
        <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 6, marginBottom: 16, color: '#b91c1c', fontSize: 14 }}>
          {error}
        </div>
      )}

      {/* Send result */}
      {sendResult && (
        <div style={{ padding: '10px 14px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 6, marginBottom: 16, fontSize: 14 }}>
          ✓ Sent {sendResult.sent} emails. Total sent: {sendResult.sentTotal}. Status: <strong>{sendResult.status}</strong>.
          {sendResult.error && <div style={{ color: '#b91c1c', marginTop: 4 }}>{sendResult.error}</div>}
          {sendResult.status === 'paused' && (
            <div style={{ marginTop: 4, color: '#555' }}>Come back tomorrow to send the next batch.</div>
          )}
        </div>
      )}

      {/* Dry run button */}
      <button
        onClick={() => callSend(true)}
        disabled={loading || selectedLocales.length === 0}
        style={{ padding: '8px 20px', background: '#1a1a1a', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 12, opacity: loading ? 0.6 : 1 }}
      >
        {loading && !dryRunResult ? 'Loading…' : '1. Preview Recipients'}
      </button>

      {/* Dry run result */}
      {dryRunResult && (
        <div style={{ margin: '20px 0', padding: '14px 16px', background: '#f8f8f8', border: '1px solid #ddd', borderRadius: 6, fontSize: 13 }}>
          <strong>Preview — page {dryRunResult.page}, {dryRunResult.pageTotal} recipients in this batch (total matching: {dryRunResult.total}):</strong>
          <div style={{ marginTop: 8, maxHeight: 200, overflowY: 'auto' }}>
            {dryRunResult.recipients.map((r) => (
              <div key={r.id} style={{ padding: '2px 0', color: '#333' }}>
                {r.email} <span style={{ color: '#999' }}>({r.locale})</span>
              </div>
            ))}
          </div>

          {!showConfirm && (
            <button
              onClick={() => setShowConfirm(true)}
              style={{ marginTop: 12, padding: '8px 20px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer' }}
            >
              2. Send to these {dryRunResult.pageTotal} recipients →
            </button>
          )}

          {showConfirm && (
            <div style={{ marginTop: 12, padding: '12px 16px', background: '#fff3cd', border: '1px solid #ffc107', borderRadius: 6 }}>
              <strong>⚠️ Confirm:</strong> You are about to send to <strong>{dryRunResult.pageTotal}</strong> recipients. This cannot be undone.
              <div style={{ marginTop: 10 }}>
                <button
                  onClick={() => callSend(false)}
                  disabled={loading}
                  style={{ padding: '7px 18px', background: '#dc2626', color: '#fff', border: 'none', borderRadius: 4, cursor: 'pointer', marginRight: 10, opacity: loading ? 0.6 : 1 }}
                >
                  {loading ? 'Sending…' : 'Confirm Send'}
                </button>
                <button
                  onClick={() => setShowConfirm(false)}
                  style={{ padding: '7px 18px', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: 4, cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
