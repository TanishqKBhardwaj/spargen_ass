import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { BsMoon, BsSun } from "react-icons/bs";
import { useTheme } from "./ui/theme-provider";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "sonner";
import { logout as logoutAction } from "../redux/slices/authSlice";

export default function Navbar() {
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = () => {
    if (query.trim() !== "") {
      navigate(`/product?search=${encodeURIComponent(query)}`);
      setSidebarOpen(false); // close sidebar after search on mobile
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const handleLogout = () => {
    dispatch(logoutAction());
    toast.success("Logged out successfully");
    navigate("/");
  };

  return (
    <>
      <nav className="flex items-center justify-between px-6 py-4 max-w-7xl w-full text-foreground">
        {/* Left side: Hamburger or Brand */}
        <div className="flex items-center space-x-4">
          {/* Hamburger icon - shown only on mobile */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-foreground focus:outline-none"
            aria-label="Open menu"
          >
            <FaBars size={24} />
          </button>

          {/* Brand text */}
          <div className="text-2xl font-bold text-foreground">Exclusive</div>
        </div>

        {/* Center: Links - shown on md+ */}
        <ul className="hidden md:flex space-x-10 font-medium text-foreground">
          <li>
            <Link to="/" className="hover:text-blue-600">
              Home
            </Link>
          </li>
          <li>
            <Link to="/allOrders" className="hover:text-blue-600">
              Orders
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-blue-600">
              About
            </Link>
          </li>

          {!token ? (
            <li>
              <Link to="/signup" className="hover:text-blue-600">
                Sign Up
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={handleLogout}
                className="hover:text-red-600 cursor-pointer bg-transparent border-none p-0"
              >
                Logout
              </button>
            </li>
          )}

          <li>
            <Link to="/admin" className="hover:text-blue-600">
              Admin
            </Link>
          </li>
        </ul>

        {/* Right side: Search + icons (desktop only) */}
        <div className="hidden sm:flex items-center space-x-4 text-foreground">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="px-3 py-1 rounded border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          {/* Wishlist icon */}
          <button
            aria-label="Wishlist"
            className="hover:text-red-500"
            onClick={() => navigate("/wishlist")}
          >
            <FaHeart size={22} />
          </button>

          {/* Cart icon */}
          <button
            aria-label="Cart"
            className="hover:text-green-600"
            onClick={() => navigate("/cart")}
          >
            <FaShoppingCart size={22} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="hover:text-yellow-500"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Sidebar Overlay */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      ></div>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-background z-50 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } shadow-lg text-foreground flex flex-col`}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="text-2xl font-bold">Menu</div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="focus:outline-none"
            aria-label="Close menu"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Search bar inside sidebar */}
        <div className="px-6 py-3 border-b border-gray-200 dark:border-gray-700">
          <input
            type="text"
            placeholder="What are you looking for?"
            className="w-full px-3 py-2 rounded border border-gray-300 dark:border-gray-600 bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button
            onClick={handleSearch}
            className="mt-2 w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Search
          </button>
        </div>

        {/* Menu Links */}
        <ul className="flex flex-col mt-6 space-y-6 px-6 font-medium flex-grow overflow-auto">
          <li>
            <Link
              to="/"
              className="block hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/allOrders"
              className="block hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Orders
            </Link>
          </li>
          <li>
            <Link
              to="/about"
              className="block hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              About
            </Link>
          </li>
          {!token ? (
            <li>
              <Link
                to="/signup"
                className="block hover:text-blue-600"
                onClick={() => setSidebarOpen(false)}
              >
                Sign Up
              </Link>
            </li>
          ) : (
            <li>
              <button
                onClick={() => {
                  dispatch(logoutAction());
                  toast.success("Logged out successfully");
                  setSidebarOpen(false);
                  navigate("/");
                }}
                className="block hover:text-red-600 cursor-pointer bg-transparent border-none p-0 text-left"
              >
                Logout
              </button>
            </li>
          )}
          <li>
            <Link
              to="/admin"
              className="block hover:text-blue-600"
              onClick={() => setSidebarOpen(false)}
            >
              Admin
            </Link>
          </li>
        </ul>

        {/* Bottom Icons (Wishlist, Cart, Theme toggle) for convenience on mobile */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
          <button
            aria-label="Wishlist"
            className="hover:text-red-500"
            onClick={() => {
              navigate("/wishlist");
              setSidebarOpen(false);
            }}
          >
            <FaHeart size={22} />
          </button>

          <button
            aria-label="Cart"
            className="hover:text-green-600"
            onClick={() => {
              navigate("/cart");
              setSidebarOpen(false);
            }}
          >
            <FaShoppingCart size={22} />
          </button>

          <button
            onClick={() => {
              toggleTheme();
              setSidebarOpen(false);
            }}
            className="hover:text-yellow-500"
            aria-label="Toggle Theme"
          >
            {theme === "dark" ? <BsSun size={20} /> : <BsMoon size={20} />}
          </button>
        </div>
      </div>
    </>
  );
}
