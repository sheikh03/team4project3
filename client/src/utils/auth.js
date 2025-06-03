import jwtDecode from 'jwt-decode';

export const signToken = (token) => {
  localStorage.setItem('id_token', token);
};

export const getToken = () => {
  return localStorage.getItem('id_token');
};

export const logout = () => {
  localStorage.removeItem('id_token');
};

export const isAuthenticated = () => {
  const token = getToken();
  if (!token) {
    return false;
  }
  try {
    const { exp } = jwtDecode(token);
    return Date.now() < exp * 1000; // check if token is expired
  } catch {
    return false;
  }
};
