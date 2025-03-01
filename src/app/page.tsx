'use client';
import './globals.css';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { login } from '@/store/authSlice';

export interface AuthState {
  status: boolean;
  userData: any | null; // Replace `any` with a more specific type if you know the structure of userData
}

function Page() {
  const { data: session, status } = useSession();
  const userStatus = useSelector((state: { auth: AuthState })  => state.auth.status);
  const dispatch = useDispatch();
  useEffect(() => {
    // Check localStorage on component mount
    const storedSession = localStorage.getItem('session');
    if (storedSession) {
      try {
        const parsedSession = JSON.parse(storedSession);
        dispatch(login(parsedSession))
      } catch (error) {
        console.error('Error parsing stored session:', error);
        localStorage.removeItem('session');
      }
    }
  }, [dispatch]);

  useEffect(() => {
    // Update localStorage when session changes
    if (session) {
      localStorage.setItem('session', JSON.stringify(session));
      console.log(session.user)
      dispatch(login(session))
    }
  }, [session,dispatch]);

  // Show loading state only on initial load when no local data is available
  if (status === 'loading' && !userStatus) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const isAuthenticated = session || userStatus;

  return (
    <div className="flex flex-col items-center py-8 h-screen">
      {isAuthenticated ? (
        <div className="py-4 px-8 bg-green-200 rounded-lg">
          <p className="text-green-800 font-semibold">
            Welcome, { (session?.user.username) || 'User'}!
          </p>
          <p>You are logged in.</p>
        </div>
      ) : (
        <div className="py-4 px-8 bg-red-200 rounded-lg">
          <p className="text-red-800 font-semibold">You are not logged in.</p>
          <p>Please sign in to access more features.</p>
        </div>
      )}
    </div>
  );
}

export default Page;