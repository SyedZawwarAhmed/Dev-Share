import { Module } from '@nestjs/common';
import { TwitterStrategy } from './twitter.strategy';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [TwitterStrategy],
  exports: [TwitterStrategy],
})
export class TwitterModule {}