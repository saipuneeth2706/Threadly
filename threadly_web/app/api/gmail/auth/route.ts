import { NextResponse } from 'next/server'
import { getOAuth2Client } from '@/lib/gmail'

export async function GET() {
  try {
    // Debug: Check if environment variables are loaded
    const hasClientId = !!process.env.GMAIL_CLIENT_ID
    const hasClientSecret = !!process.env.GMAIL_CLIENT_SECRET
    const redirectUri = process.env.GMAIL_REDIRECT_URI || 'http://localhost:3000/api/gmail/auth/callback'
    
    console.log('OAuth Config Check:', {
      hasClientId,
      hasClientSecret,
      redirectUri,
      clientIdLength: process.env.GMAIL_CLIENT_ID?.length || 0
    })
    
    if (!hasClientId || !hasClientSecret) {
      return NextResponse.json(
        { error: 'Missing Gmail credentials. Please check .env.local file' },
        { status: 500 }
      )
    }
    
    const oauth2Client = getOAuth2Client()
    
    const scopes = [
      'https://www.googleapis.com/auth/gmail.readonly',
      'https://www.googleapis.com/auth/gmail.send'
    ]
    
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: scopes,
      prompt: 'consent'
    })
    
    return NextResponse.json({ authUrl })
  } catch (error: any) {
    console.error('Error generating auth URL:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

