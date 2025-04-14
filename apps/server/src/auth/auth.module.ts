import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local/local.strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { GoogleModule } from './google/google.module';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') ?? '',
        signOptions: {
          expiresIn: '1d',
        },
      }),
      inject: [ConfigService],
    }),
    // JwtModule,
    GoogleModule,
  ],
  controllers: [AuthController],
  providers: [
    ConfigService,
    AuthService,
    LocalStrategy,
    JwtStrategy,
    PrismaService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
