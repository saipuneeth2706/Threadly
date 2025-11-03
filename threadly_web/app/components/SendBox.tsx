"use client"
import React, { useState } from 'react'

type Props = {
  onSend?: (text: string) => void
}

export default function SendBox({ onSend }: Props) {
  const [text, setText] = useState('')
  const [typingPulse, setTypingPulse] = useState(false)

  const handleSend = () => {
    if (!text.trim()) return
    if (onSend) onSend(text.trim())
    else {
      // fallback behavior for backward compatibility
      // eslint-disable-next-line no-alert
      alert(`Sent: ${text}`)
      console.log('Sent message:', text)
    }
    setText('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  const handleChange = (value: string) => {
    setText(value)
    // quick pulse animation to make typing feel smooth
    setTypingPulse(true)
    window.clearTimeout((handleChange as any)._t)
    ;(handleChange as any)._t = window.setTimeout(() => setTypingPulse(false), 140)
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16 }}>
      <input
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        aria-label="message-input"
        style={{
          flex: 1,
          padding: '12px 18px',
          borderRadius: 28,
          background: '#2b2b2b',
          border: '1px solid rgba(255,255,255,0.03)',
          color: '#e6e6e6',
          transition: 'transform 120ms cubic-bezier(.2,.9,.2,1), box-shadow 120ms',
          transform: typingPulse ? 'translateY(-3px)' : 'none',
          boxShadow: typingPulse ? '0 6px 18px rgba(0,0,0,0.35)' : 'none',
        }}
      />

      <button
        type="button"
        onClick={handleSend}
        aria-label="send"
        style={{ width: 52, height: 52, borderRadius: '50%', background: '#3a3a3a', border: 'none', cursor: 'pointer', color: '#fff' }}
      >
        ➤
      </button>
    </div>
  )
}
