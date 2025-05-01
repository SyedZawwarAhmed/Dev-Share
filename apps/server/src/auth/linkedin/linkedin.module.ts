import { Module } from '@nestjs/common';
import { LinkedinStrategy } from './linkedin.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [LinkedinStrategy],
  exports: [LinkedinStrategy],
})
export class LinkedinModule {}
