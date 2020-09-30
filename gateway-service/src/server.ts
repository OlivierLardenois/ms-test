import bodyParser from 'body-parser';
import express from 'express';
import fetch from 'node-fetch';

const port = 8000;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (_, res) => {
  res.send('Hello World!');
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
