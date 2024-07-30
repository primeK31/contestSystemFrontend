import React from 'react';
import { Link } from 'react-router-dom';

function Heads() {

  
  const username = localStorage.getItem('username');

  return (
    <div>
      <header className="bg-blue-500 text-white">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
          <Link className="flex items-center gap-2" to="/">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6 w-6"
            />
            <span className="font-bold">SolvMaster</span>
          </Link>
          <nav className="hidden space-x-4 md:flex">
            <Link className="hover:text-primary-foreground/80 transition-colors" to="/">
              Home
            </Link>
            <Link className="hover:text-primary-foreground/80 transition-colors" to="/rooms">
              Rooms
            </Link>
            {username ? (
              <Link className="hover:text-primary-foreground/80 transition-colors" to='/dashboard'>
                {username}
              </Link>
            ) : (
              <Link className="hover:text-primary-foreground/80 transition-colors" to="/login">
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>
    </div>
  );
}

export default Heads;