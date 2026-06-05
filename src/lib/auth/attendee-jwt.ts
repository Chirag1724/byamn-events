import { SignJWT, jwtVerify } from 'jose';

export interface AttendeePayload {
  attendeeId: string;
  email: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not defined in environment variables.');
  }
  return new TextEncoder().encode(secret);
}

export async function signAttendeeToken(
  payload: AttendeePayload
): Promise<string> {
  const secret = getSecret();

  return new SignJWT({ attendeeId: payload.attendeeId, email: payload.email })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(secret);
}

export async function verifyAttendeeToken(
  request: Request
): Promise<AttendeePayload | null> {
  try {
    const cookieHeader = request.headers.get('cookie');
    if (!cookieHeader) return null;

    const cookies = Object.fromEntries(
      cookieHeader.split(';').map((c) => {
        const [key, ...val] = c.trim().split('=');
        return [key.trim(), decodeURIComponent(val.join('='))];
      })
    );

    const token = cookies['attendee_token'];
    if (!token) return null;

    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);

    if (
      typeof payload.attendeeId !== 'string' ||
      typeof payload.email !== 'string'
    ) {
      return null;
    }

    return { attendeeId: payload.attendeeId, email: payload.email };
  } catch {
    return null;
  }
}
