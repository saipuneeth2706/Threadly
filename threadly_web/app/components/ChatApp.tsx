"use client"
import React, { useState, useRef, useEffect } from 'react'
import SendBox from './SendBox'

type Message = { id: string; text: string; sender: 'me' | 'them'; ts: number }
type Thread = { id: string; name: string; email?: string; subject?: string; messages: Message[] }

function makeId(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 9)
}

type Props = {
  token: string
}

export default function ChatApp({ token }: Props) {
  const [threads, setThreads] = useState<Thread[]>([])
  const [selectedId, setSelectedId] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [animatedIds, setAnimatedIds] = useState<string[]>([])
  const [sending, setSending] = useState(false)
  const messagesRef = useRef<HTMLDivElement | null>(null)
  
  // Fetch threads on mount
  useEffect(() => {
    const fetchThreads = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/gmail/threads', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!response.ok) {
          throw new Error('Failed to fetch threads')
        }
        
        const data = await response.json()
        const fetchedThreads = data.threads || []
        
        setThreads(fetchedThreads)
        setSelectedId(prev => prev || (fetchedThreads.length > 0 ? fetchedThreads[0].id : ''))
      } catch (error) {
        console.error('Error fetching threads:', error)
        alert('Failed to load emails')
      } finally {
        setLoading(false)
      }
    }
    
    fetchThreads()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const handleSelect = (id: string) => setSelectedId(id)
  
  const handleSend = async (text: string) => {
    if (!selectedId || sending) return
    
    const selectedThread = threads.find(t => t.id === selectedId)
    if (!selectedThread || !selectedThread.email) return
    
    const id = makeId('m')
    
    // Optimistically add message
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id !== selectedId) return t
        return {
          ...t,
          messages: [...t.messages, { id, text, sender: 'me', ts: Date.now() }],
        }
      }),
    )
    setAnimatedIds((s) => [...s, id])
    setSending(true)
    
    try {
      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          to: selectedThread.email,
          subject: selectedThread.subject || 'Re: ' + (selectedThread.subject || ''),
          text: text,
          threadId: selectedId
        })
      })
      
      if (!response.ok) {
        throw new Error('Failed to send email')
      }
      
      // Optionally refresh to get the actual message from Gmail
      // fetchThreads()
    } catch (error) {
      console.error('Error sending email:', error)
      alert('Failed to send email')
      
      // Remove the message from UI
      setThreads((prev) =>
        prev.map((t) => {
          if (t.id !== selectedId) return t
          return {
            ...t,
            messages: t.messages.filter(m => m.id !== id)
          }
        }),
      )
    } finally {
      setSending(false)
    }
  }

  const selectedThread = threads.find((t) => t.id === selectedId) ?? threads[0]

  // remove animation id after animation finishes
  useEffect(() => {
    if (animatedIds.length === 0) return
    const timers = animatedIds.map((id) =>
      window.setTimeout(() => {
        setAnimatedIds((s) => s.filter((x) => x !== id))
      }, 700),
    )
    return () => timers.forEach(clearTimeout)
  }, [animatedIds])

  // Get initials for avatar
  const getInitials = (name: string) => {
    const parts = name.split(' ')
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    }
    return name.substring(0, 2).toUpperCase()
  }

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1}}>
        <div style={{fontSize: 18, color: '#a8a8a8'}}>Loading your emails...</div>
      </div>
    )
  }

  return (
    <div style={{display: 'flex', gap: 16, flex: 1}}>
      {/* middle thread list */}
      <aside style={{width: 340, background: '#1e1e1e', borderRadius: 16, padding: 18, display: 'flex', flexDirection: 'column', gap: 12}}>
        <div style={{fontSize: 20, fontWeight: 700, color: '#f3f3f3'}}>Threadly</div>
        <div style={{display: 'flex', alignItems: 'center', gap: 12}}>
          <input
            placeholder="Search for previous mails..."
            style={{flex: 1, padding: '10px 14px', borderRadius: 20, background: '#262626', border: '1px solid rgba(255,255,255,0.03)', color: '#ddd'}}
          />
        </div>

        <div style={{overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10, paddingTop: 6}}>
          {threads.length === 0 ? (
            <div style={{padding: 20, textAlign: 'center', color: '#666'}}>
              No emails found
            </div>
          ) : (
            threads.map((thread, i) => {
              const active = thread.id === selectedId
              const initials = getInitials(thread.name)
              return (
                <button
                  key={thread.id}
                  onClick={() => handleSelect(thread.id)}
                  style={{
                    display: 'flex',
                    gap: 12,
                    alignItems: 'center',
                    padding: '12px',
                    borderRadius: 28,
                    background: active ? '#3a3a3a' : 'transparent',
                    border: active ? '2px solid rgba(255,255,255,0.06)' : '1px solid rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <div style={{width:36, height:36, borderRadius: '50%', background: '#2f2f2f', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 14, fontWeight: 600}}>{initials}</div>
                  <div style={{display:'flex', flexDirection:'column'}}>
                    <div style={{fontSize: 16, color: '#e9e9e9'}}>{thread.name}</div>
                    <div style={{fontSize: 12, color: '#a8a8a8'}}>{thread.subject || 'No Subject'}</div>
                  </div>
                </button>
              )
            })
          )}
        </div>
      </aside>

      {/* right main pane */}
      <main style={{flex: 1, display: 'flex', flexDirection: 'column', gap: 12}}>
        {selectedThread ? (
          <>
            <header style={{display: 'flex', alignItems: 'center', gap: 12, padding: '6px 12px'}}>
              <div style={{width: 48, height: 48, borderRadius: '50%', background: '#2f2f2f', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 18}}>{getInitials(selectedThread.name)}</div>
              <div style={{fontSize: 22, fontWeight: 600, color: '#f0f0f0'}}>{selectedThread.name}</div>
              <div style={{marginLeft: 'auto'}} />
            </header>

            <section style={{flex: 1, borderRadius: 14, background: '#242424', padding: 20, display: 'flex', flexDirection: 'column'}}>
              <div ref={messagesRef} style={{flex: 1, borderRadius: 12, background: '#262626', padding: 12, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 10}}>
                {selectedThread.messages.length === 0 ? (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#666'}}>
                    No messages in this thread
                  </div>
                ) : (
                  selectedThread.messages.map((m) => {
                    const isMine = m.sender === 'me'
                    const animate = animatedIds.includes(m.id)
                    return (
                      <div key={m.id} style={{alignSelf: isMine ? 'flex-end' : 'flex-start', maxWidth: '80%'}}>
                        <div
                          className={`bubble ${isMine ? 'me' : 'them'} ${animate ? 'animate' : ''}`}
                          style={{padding: '8px 12px', borderRadius: 12, background: isMine ? '#3b82f6' : '#3a3a3a', color: isMine ? '#fff' : '#eaeaea'}}
                        >
                          {m.text}
                        </div>
                      </div>
                    )
                  })
                )}
              </div>

              <SendBox onSend={handleSend} />
            </section>
          </>
        ) : (
          <div style={{flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#666'}}>
            Select a conversation to start
          </div>
        )}
      </main>
      <style>{`
        .bubble{ opacity: 1; transform-origin: bottom right; }
        .bubble.animate{
          animation: bubbleIn 560ms cubic-bezier(.2,.9,.2,1);
        }
        @keyframes bubbleIn{
          0%{ opacity: 0; transform: translateY(18px) scale(.92) }
          60%{ opacity: 1; transform: translateY(-6px) scale(1.02) }
          100%{ opacity: 1; transform: translateY(0) scale(1) }
        }
      `}</style>
    </div>
  )
}
