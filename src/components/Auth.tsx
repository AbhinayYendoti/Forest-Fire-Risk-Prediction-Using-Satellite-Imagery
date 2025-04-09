import React, { useState } from 'react';
import { signIn, signOut } from '../services/api';
import { LogIn, LogOut, User } from 'lucide-react';

export function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [error, setError] = useState('');

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      setIsLoggedIn(true);
      setError('');
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  const handleSignOut = async () => {
    await signOut();
    setIsLoggedIn(false);
  };

  if (isLoggedIn) {
    return (
      <div className="flex items-center space-x-4">
        <User className="h-5 w-5 text-gray-600" />
        <span className="text-sm text-gray-600">{email}</span>
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSignIn} className="flex items-center space-x-4">
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="px-3 py-2 border rounded-lg"
      />
      <button
        type="submit"
        className="flex items-center space-x-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200"
      >
        <LogIn className="h-4 w-4" />
        <span>Sign In</span>
      </button>
      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
}