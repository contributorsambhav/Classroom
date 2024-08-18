import { Link } from "react-router-dom";

function Navigation() {
  return (
    <nav className="bg-black text-white p-4 shadow-md  w-[50vw] mx-auto  sticky top-0 z-50">
      <div className="container mx-auto">
        <ul className="flex space-x-6 justify-center">
          <li>
            <Link
              to="/"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/signup"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Sign Up
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="hover:text-green-400 transition-colors duration-300"
            >
              Login
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navigation;
