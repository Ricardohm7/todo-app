import {useAuth} from '../contexts/AuthContext';

const BASE_URL = '/api'; // Adjust this if your API has a different base URL

export const useApi = () => {
  const {accessToken, refreshToken, logout} = useAuth();

  const fetchWithToken = async (
    endpoint: string,
    options: RequestInit = {},
  ) => {
    const url = `${BASE_URL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      const response = await fetch(url, {...options, headers});

      if (response.status === 401) {
        // Token has expired
        try {
          await refreshToken();
          // Retry the request with the new token
          return fetchWithToken(endpoint, options);
        } catch (error) {
          // If refresh fails, log out the user
          logout();
          throw new Error('Session expired. Please log in again.');
        }
      }

      if (!response.ok) {
        throw new Error('API request failed');
      }

      return response.json();
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  };

  return {
    get: (endpoint: string) => fetchWithToken(endpoint),
    post: (endpoint: string, data: any) =>
      fetchWithToken(endpoint, {method: 'POST', body: JSON.stringify(data)}),
    put: (endpoint: string, data: any) =>
      fetchWithToken(endpoint, {method: 'PUT', body: JSON.stringify(data)}),
    delete: (endpoint: string) => fetchWithToken(endpoint, {method: 'DELETE'}),
    patch: (endpoint: string, data: any) =>
      fetchWithToken(endpoint, {method: 'PATCH', body: JSON.stringify(data)}),
  };
};
