import { useAuthContext } from '../context/AuthContext';

export function useAuth() {
  const { login, logout, isAuthenticated, user, token } = useAuthContext();
  return { login, logout, isAuthenticated, user, token };
}
