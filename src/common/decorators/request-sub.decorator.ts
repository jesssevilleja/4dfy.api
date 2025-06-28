import {
  createParamDecorator,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

export const RequestSub = createParamDecorator(
  (
    data: unknown,
    context: ExecutionContext,
  ): { sub: string; refreshToken: string } => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext().req;
    // Extract the sub and refreshToken from the request object
    const sub = request.user?.sub;
    const refreshToken = request.headers?.authorization?.split(' ')[1]; // Assuming the token is in the Authorization header

    if (!sub) {
      throw new UnauthorizedException('No subject found in request');
    }

    if (!refreshToken) {
      throw new UnauthorizedException('No refresh token found in request');
    }

    return { sub, refreshToken };
  },
);
