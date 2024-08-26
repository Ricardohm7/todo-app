// components/Layout.tsx
import {ReactNode} from 'react';
import Header from './Header';
import {useAuth} from '@/contexts/AuthContext';
// import Sidebar from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({children}: LayoutProps) => {
  const {user} = useAuth();

  if (!user) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* <Sidebar /> */}
      <div className="flex flex-col flex-grow">
        <Header />
        <main className="p-4 flex-grow">{children}</main>
      </div>
    </div>
  );
};

export default Layout;
