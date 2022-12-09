import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { expressjwt } from 'express-jwt';
import jwks from 'jwks-rsa';
import { promisify } from 'node:util';
import { ConfigService } from '@nestjs/config';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class AuthorizationGuard implements CanActivate {
  private AUTH0_AUDIENCIE: string;
  private AUTH0_DOMAIN: string;

  constructor(private configService: ConfigService) {
    this.AUTH0_AUDIENCIE = this.configService.get('AUTH0_AUDIENCIE') ?? '';
    this.AUTH0_DOMAIN = this.configService.get('AUTH0_DOMAIN') ?? '';
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const { req, res } = GqlExecutionContext.create(context).getContext();

    const checkJWT = promisify(
      expressjwt({
        secret: jwks.expressJwtSecret({
          cache: true,
          rateLimit: true,
          jwksRequestsPerMinute: 5,
          jwksUri: `${this.AUTH0_DOMAIN}.well-known/jwks.json`,
        }) as jwks.GetVerificationKey,
        audience: 'ignite-lab.auth',
        issuer: 'https://iglab1.us.auth0.com/',
        algorithms: ['RS256'],
      }),
    );

    try {
      await checkJWT(req, res);
      return true;
    } catch (error) {
      throw new UnauthorizedException(error);
    }
  }
}
