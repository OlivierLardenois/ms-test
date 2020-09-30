import bodyParser from 'body-parser';
import express from 'express';
import jwt from 'jsonwebtoken';

const port = 8002;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get<{}, {}, {}, { userId: string }>('/userToken', ({ query: { userId } }, res) => {
  if (!userId) res.status(400).send('MISSING_USER_ID');

  const token = jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET!, {
    expiresIn: '15m',
  });
  return res.json({ token });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
