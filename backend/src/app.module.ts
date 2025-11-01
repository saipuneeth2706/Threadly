import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { GmailModule } from './gmail/gmail.module';
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [ConfigModule.forRoot(), AuthModule, GmailModule, HttpModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
