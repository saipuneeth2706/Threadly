"use client"
import React, { useState } from 'react'
import ChatApp from './components/ChatApp'
import GmailLogin from './components/GmailLogin'

export default function Home() {
  const [token, setToken] = useState<string>('')

  if (!token) {
    return <GmailLogin onAuth={setToken} />
  }

  return <ChatApp token={token} />
}

