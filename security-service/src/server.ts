import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

const port = 8002;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get<{}, {}, {}, { userId: string }>('/userToken', ({ query: { userId } }, res) => {
  if (!userId) res.json({ ok: false, token: '' });

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
    return res.send({ ok: false, token: '' });
  }

  return res.send({ ok: true, token: payload.userId });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
