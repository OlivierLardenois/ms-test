import bcrypt from 'bcryptjs';
import bodyParser from 'body-parser';
import express from 'express';
import userRepository from './repository';

const port = 8001;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.post<{}, {}, { email: string; password: string }>('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await userRepository.findByEmail(email);
  if (!user) {
    // TODO: handle logger
    // logger.warn('User not found');
    return res.send({ userID: null });
  }

  const match = await bcrypt.compare(password, user.password);
  if (!match) {
    // TODO: handle logger
    // logger.warn('Invalid password');
    return res.send({ userID: null });
  }

  return res.json({ userID: user.userId });
});

app.get('/me', (_, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
