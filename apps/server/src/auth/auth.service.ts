import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { AuthProvider } from 'generated/prisma';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.prisma.user.findUnique({
      where: { email: username },
    });
    if (user && user.password) {
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (isPasswordValid) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user) {
    const payload = {
      username: user?.username,
      email: user?.email,
      sub: user.id,
    };
    const token = this.jwtService.sign(payload);
    await this.prisma.session.deleteMany({
      where: {
        userId: user?.id,
      },
    });

    // Create or update session
    await this.prisma.session.create({
      data: {
        userId: user?.id,
        sessionToken: token,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
      },
    });

    return {
      user,
      token,
    };
  }

  async googleLogin(profile: any) {
    const { email, given_name, family_name, picture } = profile._json;

    // Find or create user
    const user = await this.prisma.user.upsert({
      where: { email },
      create: {
        email,
        firstName: given_name,
        lastName: family_name,
        profileImage: picture,
        isEmailVerified: true,
        accounts: {
          create: {
            type: 'oauth',
            provider: AuthProvider.GOOGLE,
            providerAccountId: profile.id,
          },
        },
      },
      update: {
        firstName: given_name,
        lastName: family_name,
        profileImage: picture,
        accounts: {
          upsert: {
            where: {
              provider_providerAccountId: {
                provider: AuthProvider.GOOGLE,
                providerAccountId: profile.id,
              },
            },
            create: {
              type: 'oauth',
              provider: AuthProvider.GOOGLE,
              providerAccountId: profile.id,
            },
            update: {},
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    return this.login(user);
  }

  async linkedinLogin(profile: any) {
    const { email, accessToken } = profile;

    const user = await this.prisma.user.update({
      where: { email },
      data: {
        accounts: {
          upsert: {
            where: {
              provider_providerAccountId: {
                provider: AuthProvider.LINKEDIN,
                providerAccountId: email,
              },
            },
            create: {
              type: 'oauth',
              provider: AuthProvider.LINKEDIN,
              providerAccountId: email,
              access_token: accessToken,
            },
            update: {
              access_token: accessToken,
            },
          },
        },
      },
      include: {
        accounts: true,
      },
    });

    console.log(
      '\n\n ---> apps/server/src/auth/auth.service.ts:136 -> user: ',
      user,
    );

    return this.login(user);
  }

  async signup(
    email: string,
    password: string,
    firstName?: string,
    lastName?: string,
  ) {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName,
        lastName,
        accounts: {
          create: {
            type: 'email',
            provider: AuthProvider.EMAIL,
            providerAccountId: email,
          },
        },
      },
    });

    // Create verification token
    const token = this.jwtService.sign({ email }, { expiresIn: '24h' });

    await this.prisma.verificationToken.create({
      data: {
        token,
        userId: user.id,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      },
    });

    // TODO: Send verification email

    const { password: _, ...result } = user;
    return { user: result, token };
  }
}
