
import { Injectable } from '@nestjs/common';
import { google } from 'googleapis';

@Injectable()
export class GmailService {
  async getEmails(accessToken: string) {
    const oauth2Client = new google.auth.OAuth2();
    oauth2Client.setCredentials({ access_token: accessToken });

    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });
    const res = await gmail.users.messages.list({
      userId: 'me',
      // You can add more parameters here, like q: 'is:unread'
    });

    return res.data;
  }
}
