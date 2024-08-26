import Login from './components/Login';
import {useAuth} from '../../contexts/AuthContext';
import {useRouter} from 'next/router';
import {useEffect} from 'react';

export default function LoginPage() {
  const {accessToken} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (accessToken) {
      router.push('/');
    }
  }, [accessToken]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Login</h1>
      <Login />
    </div>
  );
}
