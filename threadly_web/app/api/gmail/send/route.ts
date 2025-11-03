import { NextRequest, NextResponse } from 'next/server'
import { getGmailService } from '@/lib/gmail'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'No authorization token provided' },
        { status: 401 }
      )
    }
    
    const token = authHeader.substring(7)
    const gmail = getGmailService(token)
    
    const { to, subject, text, threadId } = await request.json()
    
    if (!to || !subject || !text) {
      return NextResponse.json(
        { error: 'Missing required fields: to, subject, text' },
        { status: 400 }
      )
    }
    
    // Create email message
    const message = [
      `To: ${to}`,
      `Subject: ${subject}`,
      'Content-Type: text/plain; charset=utf-8',
      '',
      text
    ].join('\n')
    
    // Encode the message
    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '')
    
    // Send the email
    const params: any = {
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    }
    
    // Add thread ID if replying
    if (threadId) {
      params.threadId = threadId
    }
    
    const response = await gmail.users.messages.send(params)
    
    return NextResponse.json({ 
      success: true, 
      messageId: response.data.id 
    })
  } catch (error: any) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

