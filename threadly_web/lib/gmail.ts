import { google } from 'googleapis'

// OAuth2 configuration
export function getOAuth2Client() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GMAIL_CLIENT_ID,
    process.env.GMAIL_CLIENT_SECRET,
    process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/gmail/auth/callback'
  )
  
  return oauth2Client
}

// Get Gmail service client
export function getGmailService(token: string) {
  const oauth2Client = getOAuth2Client()
  oauth2Client.setCredentials({ access_token: token })
  
  return google.gmail({ version: 'v1', auth: oauth2Client })
}

// Parse email headers
export function parseEmailHeaders(headers: any[]) {
  const parsed: any = {}
  headers?.forEach((header: any) => {
    parsed[header.name.toLowerCase()] = header.value
  })
  return parsed
}

// Get sender name from email
export function getSenderName(from: string): string {
  const match = from.match(/^(.+?)\s*<.+>$/)
  return match ? match[1].replace(/"/g, '') : from.split('@')[0]
}

// Parse email body
export function parseEmailBody(message: any): string {
  const payload = message.payload
  if (!payload) return ''

  // Try to get plain text body
  function extractText(part: any): string {
    if (part.mimeType === 'text/plain' && part.body.data) {
      return Buffer.from(part.body.data, 'base64').toString('utf-8')
    }
    if (part.parts) {
      return part.parts.map((p: any) => extractText(p)).join('')
    }
    return ''
  }

  return extractText(payload) || 'No content'
}

// Convert Gmail thread to app thread format
export function convertGmailThreadToAppThread(thread: any, userEmail: string) {
  const messages = thread.messages || []
  const firstMessage = messages[0]
  const headers = parseEmailHeaders(firstMessage?.payload?.headers)
  
  const sender = headers.from || 'Unknown'
  const senderName = getSenderName(sender)
  
  const appMessages = messages.map((msg: any) => {
    const msgHeaders = parseEmailHeaders(msg.payload?.headers)
    const from = msgHeaders.from || ''
    const isMe = from.includes(userEmail)
    const body = parseEmailBody(msg)
    
    return {
      id: msg.id,
      text: body,
      sender: isMe ? 'me' : 'them',
      ts: parseInt(msg.internalDate) || Date.now()
    }
  })
  
  return {
    id: thread.id,
    name: senderName,
    email: sender,
    subject: headers.subject || 'No Subject',
    messages: appMessages,
    snippet: thread.snippet || ''
  }
}

