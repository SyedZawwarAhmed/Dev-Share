import { Module } from '@nestjs/common';
import { LocalStrategy } from './local.strategy';

@Module({
  providers: [LocalStrategy],
})
export class LocalModule {}
