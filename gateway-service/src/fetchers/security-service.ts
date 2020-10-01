import fetch from 'node-fetch';
import { GenericError } from '../utils/errors';

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
    if (!response.ok) throw new Error(await response.text());

    const { ok, userId } = (await response.json()) as { ok: boolean; userId: string };
    if (!ok) throw new GenericError('UNKNOWN_USER', 'VerifyUserToken failed');
    else return userId;
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
    if (!response.ok) throw new Error(await response.text());

    const { ok, token } = (await response.json()) as { ok: boolean; token: string };
    if (!ok) throw new GenericError('UNKNOWN_USER', 'UserToken failed');
    else return token;
  }
}

const securityFetcher = new SecurityFetcher();
export default securityFetcher;
