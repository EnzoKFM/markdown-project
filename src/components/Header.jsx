import { Link } from "react-router-dom";

function Header() {
    return (
        <nav className="w-full bg-slate-900/80 backdrop-blur-sm border-b border-slate-800 px-6 py-4 mb-6">
            <div className="max-w-7xl mx-auto flex items-center justify-center space-x-8">
                <Link to="/" className="text-slate-300 hover:text-blue-400">
                    Accueil
                </Link>
                <Link
                    to="/blocks"
                    className="text-slate-300 hover:text-blue-400"
                >
                    Blocs personnalisés
                </Link>
            </div>
        </nav>
    );
}

export default Header;
