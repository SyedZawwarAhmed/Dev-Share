import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from 'src/prisma/prisma.service';
import { extractRefreshTokenFromCookies } from 'lib/cookies.util';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private prisma: PrismaService,
  ) {
    super({
      // jwtFromRequest: ExtractJwt.from,
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return extractRefreshTokenFromCookies(request);
        },
      ]),
      ignoreExpiration: true,
      secretOrKey:
        configService.get<string>('JWT_SECRET') ?? 'ahflkasnlnafihainafsdn',
    });
  }

  async validate(payload: { sub: string }) {
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
    });

    if (!user) {
      throw new UnauthorizedException();
    }

    return user;
  }
}
