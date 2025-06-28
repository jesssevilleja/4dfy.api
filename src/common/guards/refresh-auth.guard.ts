import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';

@Injectable()
export class RefreshAuthGuard extends AuthGuard('refresh-jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext().req;
  }
  
  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    console.log('RefreshAuthGuard - handleRequest', err, user, info, context);
    if (err || !user) {
      // Check if the error is due to an expired token
      if (info && info.name === 'TokenExpiredError') {
        throw new UnauthorizedException('Token has expired');
      }
      throw err || new UnauthorizedException('Unauthorized');
    }
    return user;
  }
}
