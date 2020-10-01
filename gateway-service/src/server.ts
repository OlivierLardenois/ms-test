import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import securityFetcher from './fetchers/security-service';
import userFetcher from './fetchers/user-service';
import asyncHandler from './utils/asyncHandler';
import { GenericError } from './utils/errors';

const port = 8000;

// TODO: Create a typing module (for route response, user model)
// TODO: Utils module?
// TODO: Do not forget other MS
// TODO: envfile docker-compose?

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get(
  '/me',
  asyncHandler(async (req, res) => {
    console.info('Me ...');
    const { session } = req.cookies as { session?: string };
    if (!session) return res.status(400).send('NOT_LOGGED_IN');

    const userId = await securityFetcher.verifyUserToken(req.cookies.session);
    const user = await userFetcher.me(userId);

    console.info('Successfully return current user');
    return res.json({ user });
  })
);

app.post<{}, {}, { email: string; password: string }>(
  '/login',
  asyncHandler(async (req, res) => {
    console.info('Login ...');
    const userId = await userFetcher.login(req.body.email, req.body.password);
    const token = await securityFetcher.userToken(userId);

    console.info('Successfully login user');
    return res.cookie('session', token).json({ token });
  })
);

// Must be at the end of the middleware stack
app.use(function (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.error('[Gateway-service]', err);
  if (err instanceof GenericError) {
    const statusCode = GenericError.errorCodeMapper(err.code);
    return res.status(statusCode).send(err.code);
  }

  return res.status(500).send('SERVER_ERROR');
});

app.listen(port, () => {
  console.log(`Gateway-service listening at http://localhost:${port}`);
});
