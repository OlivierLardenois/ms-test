import fetch from 'node-fetch';

const userId = 1;
const userEmail = 'olivier@test.com';
const userPassword = 'password';

describe('me route', () => {
  test('should be rejected with wrong bearer', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=${userId}`, {
      headers: { Authorization: `Bearer wrongBearer` },
    });
    expect(response.ok).toEqual(false);
  });

  test('should return me user', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=${userId}`, {
      headers: { Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}` },
    });
    expect(response.ok).toEqual(true);

    const { ok, user } = (await response.json()) as { ok: boolean; user: any };
    expect(ok).toEqual(true);
    expect(user).toBeDefined();
  });

  test('should not return unknown user', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/me?userId=-1`, {
      headers: { Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}` },
    });
    expect(response.ok).toEqual(true);

    const { ok, user } = (await response.json()) as { ok: boolean; user: any };
    expect(ok).toEqual(false);
    expect(user).toBe(null);
  });
});

describe('login route', () => {
  test('should be rejected with wrong bearer', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email: userEmail, password: userPassword }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer wrongBearer`,
      },
    });
    expect(response.ok).toEqual(false);
  });

  test('should login user', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email: userEmail, password: userPassword }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);
    if (!response.ok) throw new Error();

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    expect(ok).toEqual(true);
    expect(userId).toBeDefined();
  });

  test('should not login unknown user', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email: 'unknownEmail', password: userPassword }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);
    if (!response.ok) throw new Error();

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    expect(ok).toEqual(false);
    expect(userId).toBe('');
  });

  test('should not login wrong password', async () => {
    const response = await fetch(`${process.env.USER_SERVICE_URL!}/login`, {
      method: 'post',
      body: JSON.stringify({ email: userEmail, password: 'wrongPassword' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);
    if (!response.ok) throw new Error();

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    expect(ok).toEqual(false);
    expect(userId).toBe('');
  });
});
