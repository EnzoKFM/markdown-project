import { Routes, Route, Link } from "react-router-dom";
import Home from "./pages/Home";
import Blocks from "./pages/Blocks";

function App() {
  return (
    <>
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
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/blocks" element={<Blocks />} />
      </Routes>
    </>
  );
}

export default App;
