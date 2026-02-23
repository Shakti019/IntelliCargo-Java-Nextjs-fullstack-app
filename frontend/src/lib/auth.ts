import { jwtVerify } from 'jose';

// This secret MUST match the sink in backend-core/src/main/resources/application.yml
// The backend treats this string as Base64 encoded.
const secretKeyString = process.env.JWT_SECRET || "WW91clNlY3JldEtleVNob3VsZEJlTG9uZ0FuZFNlY3VyZUVub3VnaEZvckhTMjU2QWxnb3JpdGht";

let JWT_SECRET: Uint8Array;

try {
  // Try using Buffer (Node.js environment)
  JWT_SECRET = new Uint8Array(Buffer.from(secretKeyString, 'base64'));
} catch (e) {
  // Fallback for Edge/Browser environment where Buffer might not be Polyfilled
  JWT_SECRET = new Uint8Array(
    atob(secretKeyString).split('').map(c => c.charCodeAt(0))
  );
}

export async function verifyJwt(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload; // Returns the decoded user details (sub, roles, etc.)
  } catch (error) {
    console.error('JWT Verification failed:', error);
    return null;
  }
}

export function getJwtFromHeader(req: Request): string | null {
  const authHeader = req.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  return authHeader.split(' ')[1];
}
