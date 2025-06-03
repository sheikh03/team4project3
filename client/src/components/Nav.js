import React from 'react';
import { Link } from 'react-router-dom';
import { isAuthenticated, logout } from '../utils/auth';
import './Nav.css';

function Nav() {
  const loggedIn = isAuthenticated();

  return (
    <nav className="nav-bar">
      <Link to="/" className="nav-logo">
        MyMERNApp
      </Link>
      <div className="nav-links">
        {loggedIn ? (
          <>
            <Link to="/dashboard" className="nav-link">
              Dashboard
            </Link>
            <button
              className="nav-link"
              onClick={() => {
                logout();
                window.location.assign('/');
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/signup" className="nav-link">
              Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Nav;