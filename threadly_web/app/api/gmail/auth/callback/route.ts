import { NextResponse } from 'next/server'
import { getOAuth2Client } from '@/lib/gmail'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    
    if (!code) {
      return NextResponse.json(
        { error: 'No authorization code provided' },
        { status: 400 }
      )
    }
    
    const oauth2Client = getOAuth2Client()
    const { tokens } = await oauth2Client.getToken(code)
    
    // In production, you'd store these tokens securely in a database
    // For now, we'll return them to the client to store in localStorage
    return NextResponse.redirect(
      new URL('/?token=' + encodeURIComponent(tokens.access_token || ''), request.url)
    )
  } catch (error: any) {
    console.error('Error exchanging code for tokens:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

