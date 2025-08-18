import { cookies } from 'next/headers';

export function getAdminFromSession(): number | null {
  try {
    const adminNoCookie = cookies().get('adminNo');
    if (!adminNoCookie || !adminNoCookie.value) {
      return null;
    }
    return parseInt(adminNoCookie.value, 10);
  } catch (err) {
    return null;
  }
}

export function requireAdmin(): number {
  const adminNo = getAdminFromSession();
  if (!adminNo) {
    throw new Error('Unauthorized');
  }
  return adminNo;
}
