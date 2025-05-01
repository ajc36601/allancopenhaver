'use client';

import { useState, useEffect } from 'react';
import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsModalOpen(false);
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const navLinks = [
    { name: 'Doing', href: '/doing' },
    { name: 'Watching', href: '/watching' },
    { name: 'Reading', href: '/reading' },
  ];

  const handleModalClose = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setIsModalOpen(false);
    }
  };

  return (
    <div className='border-b-black-200 border-b-2 mr-10 ml-10 mb-10'>
      <nav className="flex items-center justify-between">
        {/* Left - Logo SVG */}
        <Link href="/">
            <img
              src="/allancopenhaver.png"
              alt="Allan Copenhaver Logo"
              className="h-60 w-auto ml-10 hover:scale-105 transition-transform"
            />
        </Link>



        {/* Middle - Nav Links */}
        <div className="hidden md:flex flex-col items-center gap-1">
          <span className="font-semibold text-gray-700">What Am I?</span>
          <div className="flex gap-3">
            {navLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  'px-3 py-1 rounded-lg transition-transform duration-200 hover:scale-105',
                  pathname === href
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                )}
              >
                {name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right - Profile / Sign-In or Hamburger */}
        <div className="mr-10 flex items-center gap-4">
          {/* Desktop view: show profile or sign-in */}
          <div className="hidden md:block">
            {!session ? (
              <button
                onClick={() => signIn('google')}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 cursor-pointer"
              >
                Sign in with Google
              </button>
            ) : (
              <img
                src={session.user?.image || '/default-avatar.png'}
                alt="Profile"
                className="w-9 h-9 rounded-full cursor-pointer"
                onClick={() => setIsModalOpen(true)}
              />
            )}
          </div>

          {/* Mobile view: Hamburger */}
          <button
            className="md:hidden text-gray-700 cursor-pointer"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-gray-100 shadow-inner p-4 space-y-4">
          <p className="text-center font-semibold text-gray-700">What Am I?</p>
          <div className="flex flex-col items-center gap-2">
            {navLinks.map(({ name, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={clsx(
                  'w-full text-center px-3 py-2 rounded-lg',
                  pathname === href
                    ? 'text-white bg-blue-600'
                    : 'text-gray-700 hover:bg-blue-100'
                )}
              >
                {name}
              </Link>
            ))}
          </div>
          <div className="border-t pt-4">
            {!session ? (
              <button
                onClick={() => {
                  signIn('google');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
              >
                Sign in with Google
              </button>
            ) : (
              <div className="flex justify-center w-full cursor-pointer hover:bg-blue-100 rounded-md py-2" onClick={() => setIsModalOpen(true)}>
                <div className="flex items-center gap-2">
                  <img
                    src={session.user?.image || '/default-avatar.png'}
                    alt="Profile"
                    className="w-8 h-8 rounded-full"
                  />
                  <p className="text-sm text-gray-700">{session.user?.name}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal for account actions */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={handleModalClose}
        >
          <div className="bg-white rounded-lg shadow-xl w-80 p-6 relative">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <img
                src={session?.user?.image || '/default-avatar.png'}
                alt="Profile"
                className="w-16 h-16 rounded-full border-2 border-gray-200"
              />
              <div>
                <p className="font-semibold text-gray-800 mb-1">{session?.user?.name}</p>
                <p className="text-sm text-gray-500">{session?.user?.email}</p>
              </div>
            </div>

            <button
              onClick={() => {
                setIsModalOpen(false);
                signIn('google');
              }}
              className="w-full bg-gray-100 text-gray-700 px-4 py-2 rounded hover:bg-gray-200 cursor-pointer mb-2"
            >
              Switch Account
            </button>
            <button
              onClick={() => {
                setIsModalOpen(false);
                signOut();
              }}
              className="w-full bg-red-100 text-red-600 px-4 py-2 rounded hover:bg-red-200 cursor-pointer"
            >
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
