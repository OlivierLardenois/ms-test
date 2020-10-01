import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import express from 'express';
import userRepository from './repository';
import asyncHandler from './utils/asyncHandler';

const port = 8001;

function requiredAuthorization(
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  const authorization = req.get('Authorization') as String | undefined;
  if (
    !authorization ||
    authorization.split(' ')[0] !== 'Bearer' ||
    authorization.split(' ')[1] !== process.env.GATEWAY_AUTHORIZATION_BEARER
  ) {
    console.warn('Forbidden access to user-service');
    return res.status(403).send('FORBIDDEN');
  }

  return next();
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requiredAuthorization);

app.post<{}, {}, { email: string; password: string }>(
  '/login',
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await userRepository.findByEmail(email);
    if (!user) {
      console.warn('User not found');
      return res.json({ ok: false, userId: '' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      console.warn('Invalid password');
      return res.json({ ok: false, userId: '' });
    }

    console.info('Successfully login user');
    return res.json({ ok: true, userId: user.userId });
  })
);

app.get<{}, {}, {}, { userId: string }>(
  '/me',
  asyncHandler(async (req, res) => {
    const user = await userRepository.findById(req.query.userId);
    if (!user) {
      console.warn('User not found');
      return res.json({ ok: false, user: null });
    }

    console.info('Successfully retrieve me user');
    return res.json({ ok: true, user });
  })
);

// Must be at the end of the middleware stack
app.use(function (
  err: Error,
  _req: express.Request,
  res: express.Response,
  _next: express.NextFunction
) {
  console.error('User-service', err);
  res.status(500).send('User-service server error');
});

app.listen(port, () => {
  console.log(`User-service listening at http://localhost:${port}`);
});
