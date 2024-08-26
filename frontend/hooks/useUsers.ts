import {useState, useCallback} from 'react';
import {useApi} from '../services/api';
import {User} from '@/models/User';

export const useUsers = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = useApi();

  const fetchUser = useCallback(
    async (userId: string) => {
      setLoading(true);
      setError(null);
      try {
        const data = await api.get(`/users/${userId}`);
        setUser(data);
      } catch (err) {
        setError('Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    },
    [api],
  );

  return {
    user,
    fetchUser,
    loading,
    error,
  };
};
