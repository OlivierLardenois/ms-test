import fetch from 'node-fetch';

const userId = 1;
let userToken: string;

describe('userToken route', () => {
  test('should be rejected with wrong bearer', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/userToken`, {
      method: 'post',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer wrongBearer`,
      },
    });
    expect(response.ok).toEqual(false);
  });

  test('should get user token', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/userToken`, {
      method: 'post',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);

    const { ok, token } = (await response.json()) as { ok: boolean; token: string };
    expect(ok).toEqual(true);
    expect(token).toBeDefined();
    userToken = token;
  });

  test('should not sign token with null userId', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/userToken`, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);

    const { ok, token } = (await response.json()) as { ok: boolean; token: string };
    expect(ok).toEqual(false);
    expect(token).toBe('');
  });
});

describe('verifyUserToken route', () => {
  test('should be rejected with wrong bearer', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/verifyUserToken`, {
      method: 'post',
      body: JSON.stringify({ token: userToken }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer wrongBearer`,
      },
    });
    expect(response.ok).toEqual(false);
  });

  test('should verify correct user token', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/verifyUserToken`, {
      method: 'post',
      body: JSON.stringify({ token: userToken }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);

    const { ok, userId: decodedUserId } = (await response.json()) as {
      ok: boolean;
      userId: string;
    };
    expect(ok).toEqual(true);
    expect(decodedUserId).toBe(userId);
  });

  test('should not verify wrong user token', async () => {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/verifyUserToken`, {
      method: 'post',
      body: JSON.stringify({ token: 'wrongToken' }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    expect(response.ok).toEqual(true);

    const { ok, userId: decodedUserId } = (await response.json()) as {
      ok: boolean;
      userId: string;
    };
    expect(ok).toEqual(false);
    expect(decodedUserId).toBe('');
  });
});
