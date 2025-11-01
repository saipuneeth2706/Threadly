import { Controller, Get, Req, UseGuards, Delete } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { User } from '../types';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect(@Req() req: Request & { user: User }) {
    return this.authService.googleLogin(req);
  }

  @Delete('google/revoke')
  async googleLogout(@Req() req: Request & { user: User }) {
    await this.authService.googleLogout(req);
    return { message: 'Google access revoked successfully' };
  }
}
