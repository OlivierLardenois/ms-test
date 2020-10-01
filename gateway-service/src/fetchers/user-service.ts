import fetch from 'node-fetch';

class UserFetcher {
  public async me(userId: string) {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=${userId}`, {
      headers: { Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}` },
    });
    if (!response.ok) throw new Error(await response.text());

    const { ok, user } = (await response.json()) as { ok: boolean; user: any };
    if (!ok) throw new Error('Me failed');
    else return user;
  }

  public async login(email: string, password: string) {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email, password }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    if (!response.ok) throw new Error(await response.text());

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    if (!ok) throw new Error('Login failed');
    else return userId;
  }
}

const userFetcher = new UserFetcher();
export default userFetcher;
