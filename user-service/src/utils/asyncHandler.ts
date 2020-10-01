import { NextFunction, Request, RequestHandler, Response } from 'express';
import { ParamsDictionary, Query } from 'express-serve-static-core';

const asyncHandler = <
  P = ParamsDictionary,
  ResBody = any,
  ReqBody = any,
  ReqQuery = Query
>(
  fn: RequestHandler<P, ResBody, ReqBody, ReqQuery>
) => (
  req: Request<P, ResBody, ReqBody, ReqQuery>,
  res: Response<ResBody>,
  next: NextFunction
) => {
  return Promise.resolve(fn(req, res, next)).catch(next);
};

export default asyncHandler;
