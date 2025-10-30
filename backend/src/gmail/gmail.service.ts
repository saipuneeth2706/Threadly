
import { Injectable } from '@nestjs/common';
import { google, gmail_v1 } from 'googleapis'; // Import gmail_v1 for types

@Injectable()
export class GmailService {
  async getEmails(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const res = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 200,
    });

    const messages = res.data.messages || [];

    // Fetch full details for each message
    const fullMessages = await Promise.all(
      messages.map(async (message) => {
        // Ensure message.id is treated as a string
        const msg = await gmail.users.messages.get({
          userId: 'me',
          id: message.id!,
          format: 'full', // Request full message payload
        });
        return msg.data;
      })
    );

    return fullMessages;
  }
}
