import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '../../auth/dto/role.enum';
export interface GetUserType {
  userId: number;
  email: string;
  roles: Role[];
}
export const GetUser = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user as GetUserType; // Returns the user object injected by AuthGuard
  },
);