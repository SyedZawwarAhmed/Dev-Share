import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { ConfigService } from '@nestjs/config';

@Module({
  providers: [GoogleStrategy, ConfigService],
})
export class GoogleModule {}
