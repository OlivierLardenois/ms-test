import fetch from 'node-fetch';

class SecurityFetcher {
  public async verifyUserToken(token: string) {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/verifyUserToken`, {
      method: 'post',
      body: JSON.stringify({ token }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    if (!response.ok) {
      console.error('[verifyUserToken] :', JSON.stringify(response));
      throw new Error();
    }

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    if (!ok) {
      console.warn('VerifyUserToken failed');
      throw new Error();
    } else return userId;
  }

  public async userToken(userId: string) {
    const response = await fetch(`${process.env.SECURITY_SERVICE_URL!}/userToken`, {
      method: 'post',
      body: JSON.stringify({ userId }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GATEWAY_AUTHORIZATION_BEARER}`,
      },
    });
    if (!response.ok) {
      console.error('[userToken] :', JSON.stringify(response));
      throw new Error();
    }

    const { ok, token } = (await response.json()) as { ok: boolean; token: string };
    if (!ok) {
      console.warn('UserToken failed');
      throw new Error();
    } else return token;
  }
}

const securityFetcher = new SecurityFetcher();
export default securityFetcher;
