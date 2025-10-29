
const express = require('express');
const { google } = require('googleapis');
require('dotenv').config();

const app = express();
const PORT = 3001;

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.REDIRECT_URI
);

let userTokens = null;


app.get('/auth/google', (req, res) => {
  const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  res.redirect(url);
});

app.get('/auth/google/callback', async (req, res) => {
  const { code } = req.query;
  try {
    const { tokens } = await oauth2Client.getToken(code);
    userTokens = tokens;
    res.redirect('/emails'); 
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    res.status(500).send('Authentication failed.');
  }
});

app.get('/emails', async (req, res) => {
  if (!userTokens) {
    return res.redirect('/auth/google');
  }

  oauth2Client.setCredentials(userTokens);
  const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

  try {
    const response = await gmail.users.messages.list({
      userId: 'me',
      maxResults: 10,
    });

    const messages = response.data.messages;
    if (!messages || messages.length === 0) {
      return res.send('No new messages found.');
    }

    const emailPromises = messages.map((message) =>
      gmail.users.messages.get({
        userId: 'me',
        id: message.id,
      })
    );

    const emailResponses = await Promise.all(emailPromises);

    const emails = emailResponses.map((emailRes) => {
      const { data } = emailRes;
      const headers = data.payload.headers;
      
      let body = '';
      if (data.payload.parts) {
        const part = data.payload.parts.find(p => p.mimeType === 'text/plain');
        if (part && part.body.data) {
          body = Buffer.from(part.body.data, 'base64').toString('utf8');
        }
      } else if (data.payload.body.data) {
        body = Buffer.from(data.payload.body.data, 'base64').toString('utf8');
      }

      return {
        id: data.id,
        snippet: data.snippet,
        from: headers.find((h) => h.name === 'From').value,
        subject: headers.find((h) => h.name === 'Subject').value,
        date: headers.find((h) => h.name === 'Date').value,
        body: body, 
      };
    });

    res.json(emails);

  } catch (error) {
    console.error('The API returned an error: ' + error);
    if (error.code === 401) {
        userTokens = null;
        return res.redirect('/auth/google');
    }
    res.status(500).send('Failed to fetch emails.');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});