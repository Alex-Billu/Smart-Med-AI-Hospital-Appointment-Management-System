import Cookies from 'js-cookie';
import { User } from '@/types';

export const saveAuth = (token: string, user: User) => {
  Cookies.set('kmch_token', token, { expires: 7 });
  Cookies.set('kmch_user', JSON.stringify(user), { expires: 7 });
  if (typeof window !== 'undefined') {
    localStorage.setItem('kmch_token', token);
    localStorage.setItem('kmch_user', JSON.stringify(user));
  }
};

export const clearAuth = () => {
  Cookies.remove('kmch_token');
  Cookies.remove('kmch_user');
  if (typeof window !== 'undefined') {
    localStorage.removeItem('kmch_token');
    localStorage.removeItem('kmch_user');
  }
};

export const getUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = Cookies.get('kmch_user') || localStorage.getItem('kmch_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch (e) {
    return null;
  }
};

export const getToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return Cookies.get('kmch_token') || localStorage.getItem('kmch_token');
};

export const isLoggedIn = (): boolean => {
  return !!getToken();
};
