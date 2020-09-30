import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import express from 'express';
import fetch from 'node-fetch';

const port = 8000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/me', async (req, res) => {
  const { session } = req.cookies as { session?: string };
  if (!session) return res.status(400).send('NOT_LOGGED_IN');

  const securityRes = (await (
    await fetch(`${process.env.SECURITY_SERVICE_URL!}/verifyUserToken`, {
      method: 'post',
      body: JSON.stringify({ token: req.cookies.session }),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json()) as { ok: boolean; userId: string };
  if (!securityRes.ok) return res.status(400).send('NOT_LOGGED_IN');

  const userRes = (await (
    await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=${securityRes.userId}`)
  ).json()) as { ok: boolean; user: any };
  if (!userRes.ok) return res.status(400).send('NO_SUCH_USER');

  return res.json({ user: userRes.user });
});

app.post<{}, {}, { email: string; password: string }>('/login', async (req, res) => {
  const userRes = (await (
    await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email: req.body.email, password: req.body.password }),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json()) as { ok: boolean; userId: string };
  if (!userRes.ok) return res.status(400).send('INVALID_CREDENTIALS');

  const securityRes = (await (
    await fetch(`${process.env.SECURITY_SERVICE_URL!}/userToken`, {
      method: 'post',
      body: JSON.stringify({ userId: userRes.userId }),
      headers: { 'Content-Type': 'application/json' },
    })
  ).json()) as { ok: boolean; token: string };
  if (!securityRes.ok) return res.status(500).send('SERVER_ERROR');

  return res.json({ token: securityRes.token });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
