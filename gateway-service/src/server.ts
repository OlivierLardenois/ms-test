import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import securityFetcher from './fetchers/security-service';
import userFetcher from './fetchers/user-service';
import asyncHandler from './utils/asyncHandler';

const port = 8000;

// TODO: Better error handling
// TODO: Create a typing module (for route response, user model)
// TODO: Utils module?
// TODO: Test
// TODO: Better logger
// TODO: Improve error middleware
// TODO: Do not forget other MS

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get(
  '/me',
  asyncHandler(async (req, res) => {
    const { session } = req.cookies as { session?: string };
    if (!session) return res.status(400).send('NOT_LOGGED_IN');

    const userId = await securityFetcher.verifyUserToken(req.cookies.session);
    const user = await userFetcher.me(userId);

    return res.json({ user });
  })
);

app.post<{}, {}, { email: string; password: string }>(
  '/login',
  asyncHandler(async (req, res) => {
    const userId = await userFetcher.login(req.body.email, req.body.password);
    const token = await securityFetcher.userToken(userId);

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
  console.error(err);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
