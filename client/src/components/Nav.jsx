import { useAuth } from "../auth/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Menu, X, User } from "lucide-react";
export default function Nav() {
  const { isAuthenticated, user, handleLogout, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const performLogout = (e) => {
    e.preventDefault();
    handleLogout();
    setIsMenuOpen(false);
  };

  if (isLoading) {
    return (
      <nav className="w-full bg-indigo-600 shadow-sm p-4 text-white">
        <p>Loading...</p>
      </nav>
    );
  }

  const authLinks = isAuthenticated
    ? [
        { name: user?.email, isButton: true },
        { name: "Logout", onClick: performLogout, isButton: true },
      ]
    : [
        { name: "Login", path: "/login" },
        { name: "Register", path: "/register" },
      ];

  const renderLink = (link, extraClass = "") => (
    <li key={link.name} className={extraClass}>
      {link.isButton ? (
        <button
          onClick={link.onClick}
          className="font-medium flex gap-2 cursor-pointer hover:text-indigo-200 transition duration-150"
        >
          {link.name.includes("@") && <User></User>}
          {link.name}
        </button>
      ) : (
        <Link
          to={link.path}
          onClick={() => setIsMenuOpen(false)}
          className="font-medium hover:text-indigo-200 transition duration-150"
        >
          {link.name}
        </Link>
      )}
    </li>
  );

  return (
    <nav className="w-full bg-indigo-600 shadow-lg text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            to="/"
            className="text-xl font-bold tracking-wider hover:text-indigo-200 transition duration-150"
          >
            The App
          </Link>
          <ul className="hidden sm:flex sm:space-x-6">
            {authLinks.map((link) => renderLink(link, "text-sm"))}
          </ul>
          <div className="flex sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-indigo-200 hover:text-white hover:bg-indigo-700 focus:outline-none"
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? <X></X> : <Menu></Menu>}
            </button>
          </div>
        </div>
      </div>
      <div className={`${isMenuOpen ? "block" : "hidden"} sm:hidden`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-indigo-700">
          {authLinks.map((link) =>
            renderLink(
              link,
              "block px-3 py-2 text-base font-medium rounded-md hover:bg-indigo-600"
            )
          )}
        </div>
      </div>
    </nav>
  );
}
