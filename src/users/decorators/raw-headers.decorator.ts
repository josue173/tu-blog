import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const RawHeaders = createParamDecorator(
  (data: string[], ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    // const user = req.s;
    console.log(req.rawHeaders);

    return req.rawHeaders;
  },
);
