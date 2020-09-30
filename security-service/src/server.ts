import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

const port = 8002;

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

app.post<{}, {}, { userId: string }>('/userToken', ({ body: { userId } }, res) => {
  if (!userId) return res.json({ ok: false, token: '' });

  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
  return res.json({ ok: true, token });
});

app.post<{}, {}, { token: string }>('/verifyUserToken', (req, res) => {
  let payload;
  try {
    payload = jwt.verify(req.body.token, process.env.ACCESS_TOKEN_SECRET!) as {
      userId: string;
    };
  } catch (error) {
    // TODO: handle logger
    // logger.warn('Cannot verify userToken');
    return res.send({ ok: false, userId: '' });
  }

  return res.send({ ok: true, userId: payload.userId });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
