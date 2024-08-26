import {useEffect} from 'react';
import DashboardPage from './dashboard';
import {useAuth} from '../contexts/AuthContext';
import {useRouter} from 'next/router';
import {TasksProvider} from '@/contexts/TaskContext';

export default function Home() {
  const {accessToken} = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!accessToken) {
      router.push('/login');
    }
  }, [accessToken]);

  if (!accessToken) {
    return null; // or a loading spinner while redirecting
  }

  return (
    <TasksProvider>
      <div className="min-h-screen bg-gray-900">
        <h1 className="text-3xl font-bold mb-4">My tasks</h1>
        <DashboardPage />
      </div>
    </TasksProvider>
  );
}
