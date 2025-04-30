'use client';

import { signIn, signOut, useSession } from 'next-auth/react';
import Link from 'next/link';

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="flex justify-between items-center px-6 py-4 shadow-md bg-white">
      {/* Left Title */}
      <Link href="/" className="text-xl font-bold text-gray-800 hover:text-blue-600">
        Allan Copenhaver&apos;s Blog
      </Link>

      {/* Right Navigation */}
      <div className="flex gap-6 text-gray-700">
        <Link href="/doing" className="hover:text-blue-600">
          What Am I Doing
        </Link>
        <Link href="/watching" className="hover:text-blue-600">
          What Am I Watching
        </Link>
        <Link href="/reading" className="hover:text-blue-600">
          What Am I Reading
        </Link>
      </div>

      {/* Sign-In / Sign-Out Button */}
      <div className="flex items-center gap-4">
        {!session ? (
          <button
            onClick={() => signIn('google')}
            className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        ) : (
          <>
            <span className="text-gray-800">{session.user?.name}</span>
            <img
              src={session.user?.image || '/default-avatar.png'}
              alt="Profile"
              className="w-8 h-8 rounded-full"
            />
            <button
              onClick={() => signOut()}
              className="bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700"
            >
              Sign Out
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
