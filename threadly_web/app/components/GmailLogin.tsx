"use client"
import React, { useEffect } from 'react'

type Props = {
  onAuth: (token: string) => void
}

export default function GmailLogin({ onAuth }: Props) {
  const handleLogin = async () => {
    try {
      const response = await fetch('/api/gmail/auth')
      const data = await response.json()
      
      if (data.authUrl) {
        window.location.href = data.authUrl
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Failed to initiate Gmail login')
    }
  }

  useEffect(() => {
    // Check for token in URL after OAuth callback
    const urlParams = new URLSearchParams(window.location.search)
    const token = urlParams.get('token')
    
    if (token) {
      localStorage.setItem('gmail_token', token)
      onAuth(token)
      // Clean up URL
      window.history.replaceState({}, '', '/')
    } else {
      // Check if token exists in localStorage
      const storedToken = localStorage.getItem('gmail_token')
      if (storedToken) {
        onAuth(storedToken)
      }
    }
  }, [onAuth])

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      gap: 24,
      background: '#121212'
    }}>
      <div style={{ fontSize: 32, fontWeight: 700, color: '#f3f3f3' }}>
        Threadly
      </div>
      <p style={{ fontSize: 16, color: '#a8a8a8', maxWidth: 400, textAlign: 'center' }}>
        A privacy-focused email chat application powered by Gmail
      </p>
      <button
        onClick={handleLogin}
        style={{
          padding: '14px 32px',
          borderRadius: 28,
          background: '#4285f4',
          border: 'none',
          color: '#fff',
          fontSize: 16,
          fontWeight: 600,
          cursor: 'pointer',
          transition: 'background 200ms'
        }}
        onMouseOver={(e) => e.currentTarget.style.background = '#3367d6'}
        onMouseOut={(e) => e.currentTarget.style.background = '#4285f4'}
      >
        Sign in with Gmail
      </button>
      <p style={{ fontSize: 12, color: '#666', maxWidth: 400, textAlign: 'center' }}>
        Your emails remain private and secure. We only access what you authorize.
      </p>
    </div>
  )
}

