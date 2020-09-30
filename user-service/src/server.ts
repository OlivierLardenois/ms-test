import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import express from 'express';
import userRepository from './repository';

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
    return res.status(403).json({});
  }

  return next();
}

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(requiredAuthorization);

app.post<{}, {}, { email: string; password: string }>('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // TODO: handle logger
    // logger.warn('User not found');
    return res.send({ ok: false, userId: '' });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    // TODO: handle logger
    // logger.warn('Invalid password');
    return res.status(400).send({ ok: false, userId: '' });
  }

  return res.json({ ok: true, userId: user.userId });
});

app.get<{}, {}, {}, { userId: string }>('/me', async (req, res) => {
  const user = await userRepository.findById(req.query.userId);
  return user ? res.json({ ok: true, user }) : res.json({ ok: false, user: null });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
