import { Link } from "react-router-dom";

function Header() {
  return (
    <nav className="flex flex-row justify-center bg-blue-100 p-4 mb-6 border-b border-gray-200 space-x-6">
      <Link to="/" className="text-blue-600 hover:text-blue-800 underline">
        Accueil
      </Link>
      <Link
        to="/blocks"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Blocs personnalisés
      </Link>
      <Link
        to="/markdown"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Markdown
      </Link>
      <Link
        to="/image-library"
        className="text-blue-600 hover:text-blue-800 underline"
      >
        Bibliothèque d'images
      </Link>
    </nav>
  );
}

export default Header;
