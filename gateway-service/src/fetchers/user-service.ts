import fetch from 'node-fetch';

class UserFetcher {
  public async me(userId: string) {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=${userId}`, {
      headers: { Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}` },
    });
    if (!response.ok) {
      console.error('[me] :', JSON.stringify(response));
      throw new Error();
    }

    const { ok, user } = (await response.json()) as { ok: boolean; user: any };
    if (!ok) {
      console.warn('Me failed');
      throw new Error();
    } else return user;
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
    if (!response.ok) {
      console.error('[login] :', JSON.stringify(response));
      throw new Error();
    }

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    if (!ok) {
      console.warn('Login failed');
      throw new Error();
    } else return userId;
  }
}

const userFetcher = new UserFetcher();
export default userFetcher;
