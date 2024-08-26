import {useAuth} from '@/contexts/AuthContext';
import {useUsers} from '@/hooks/useUsers';
import {useEffect, useState} from 'react';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const {logout, user: userAuth} = useAuth();
  const {fetchUser, user} = useUsers();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    fetchUser(userAuth?.id || '');
  }, []);

  return (
    <header className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <span className="text-xl font-semibold">TrellCap</span>
        </div>
        {/* User Profile */}
        <div className="relative">
          <button
            onClick={toggleMenu}
            className="flex items-center focus:outline-none"
          >
            <span className="ml-2 hidden md:inline">{user?.username}</span>
            <svg
              className="w-4 h-4 ml-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10">
              <button
                onClick={logout}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
              >
                Log Out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
