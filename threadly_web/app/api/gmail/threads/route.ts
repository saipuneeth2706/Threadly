import { NextRequest, NextResponse } from 'next/server'
import { getGmailService, convertGmailThreadToAppThread } from '@/lib/gmail'

export async function GET(request: NextRequest) {
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
    
    // Get user's email address
    const profile = await gmail.users.getProfile({ userId: 'me' })
    const userEmail = profile.data.emailAddress || ''
    
    // Fetch threads
    const threadsResponse = await gmail.users.threads.list({
      userId: 'me',
      maxResults: 200,
      q: 'in:inbox'
    })
    
    const threads = threadsResponse.data.threads || []
    
    // Fetch full thread details
    const fullThreads = await Promise.all(
      threads.map(async (thread) => {
        const threadData = await gmail.users.threads.get({
          userId: 'me',
          id: thread.id!
        })
        return threadData.data
      })
    )
    
    // Convert to app format
    const appThreads = fullThreads.map(thread => 
      convertGmailThreadToAppThread(thread, userEmail)
    )
    
    return NextResponse.json({ threads: appThreads })
  } catch (error: any) {
    console.error('Error fetching threads:', error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}

