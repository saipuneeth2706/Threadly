import { Controller, Get, Req } from '@nestjs/common';
import { GmailService } from './gmail.service';
import { Request } from 'express';

@Controller('gmail')
export class GmailController {
  constructor(private readonly gmailService: GmailService) {}

  @Get('emails')
  async getEmails(@Req() req: Request) {
    // In a real app, you'd get the access token from the authenticated user
    // For this example, we'll assume it's passed in the headers
    const accessToken = req.headers.authorization?.split(' ')?.[1];
    if (!accessToken) {
      return [];
    }
    return this.gmailService.getEmails(accessToken);
  }
}
