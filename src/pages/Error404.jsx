import { Link } from "react-router-dom";

function Error404() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-6xl font-extrabold text-blue-600 mb-4">404</h1>

      <h2 className="text-2xl md:text-3xl font-semibold mb-4">
        Oups... cette page n'existe pas.
      </h2>

      <p className="text-gray-600 mb-8 max-w-md">
        Il semble que vous ayez suivi un lien cassé ou saisi une URL incorrecte.
      </p>

      <Link
        to="/"
        className="px-5 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition"
      >
        Retour à l’accueil
      </Link>
    </div>
  );
}

export default Error404;
