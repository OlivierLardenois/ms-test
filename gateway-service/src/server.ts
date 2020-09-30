import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import securityFetcher from './fetchers/security-service';
import userFetcher from './fetchers/user-service';

const port = 8000;

// TODO: Better error handling

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/me', async (req, res, next) => {
  const { session } = req.cookies as { session?: string };
  if (!session) return res.status(400).send('NOT_LOGGED_IN');

  // TODO: Convert it to asyncHandler : https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
  try {
    const userId = await securityFetcher.verifyUserToken(req.cookies.session);
    const user = await userFetcher.me(userId);

    return res.json({ user });
  } catch (err) {
    return next(err);
  }
});

app.post<{}, {}, { email: string; password: string }>(
  '/login',
  async (req, res, next) => {
    // TODO: Convert it to asyncHandler : https://stackoverflow.com/questions/51391080/handling-errors-in-express-async-middleware
    try {
      const userId = await userFetcher.login(req.body.email, req.body.password);
      const token = await securityFetcher.userToken(userId);

      return res.cookie('session', token).json({ token });
    } catch (err) {
      return next(err);
    }
  }
);

// TODO: Error middleware
app.use(function (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
