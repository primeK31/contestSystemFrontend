import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function Heads() {
    const username = localStorage.getItem('username');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <div>
            <header className="bg-blue-500 text-white">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
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
                    
                    {/* Mobile menu button */}
                    <button 
                        className="md:hidden"
                        onClick={toggleMenu}
                    >
                        <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor" 
                            className="h-6 w-6"
                        >
                            <path 
                                strokeLinecap="round" 
                                strokeLinejoin="round" 
                                strokeWidth={2} 
                                d="M4 6h16M4 12h16M4 18h16" 
                            />
                        </svg>
                    </button>

                    {/* Desktop navigation */}
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

                {/* Mobile navigation */}
                {isMenuOpen && (
                    <nav className="md:hidden bg-blue-600 px-4 py-2">
                        <Link 
                            className="block py-2 hover:text-primary-foreground/80 transition-colors" 
                            to="/"
                            onClick={toggleMenu}
                        >
                            Home
                        </Link>
                        <Link 
                            className="block py-2 hover:text-primary-foreground/80 transition-colors" 
                            to="/rooms"
                            onClick={toggleMenu}
                        >
                            Rooms
                        </Link>
                        {username ? (
                            <Link 
                                className="block py-2 hover:text-primary-foreground/80 transition-colors" 
                                to='/dashboard'
                                onClick={toggleMenu}
                            >
                                {username}
                            </Link>
                        ) : (
                            <Link 
                                className="block py-2 hover:text-primary-foreground/80 transition-colors" 
                                to="/login"
                                onClick={toggleMenu}
                            >
                                Login
                            </Link>
                        )}
                    </nav>
                )}
            </header>
        </div>
    );
}

export default Heads;