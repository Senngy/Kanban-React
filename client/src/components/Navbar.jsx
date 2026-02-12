import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import ModalTagManager from "./modals/ModalTagManager";
import { FaTags } from "react-icons/fa";

function Navbar() {
  const { user, logout } = useAuth();
  const [isTagsOpen, setIsTagsOpen] = useState(false);

  return (
    <nav >
      <div className="navbar flex justify-between bg-base-100 shadow-sm">
        <div className="flex-1">
          <Link to="/" className="btn btn-ghost text-xl">
            Kanban
          </Link>
        </div>
        <ul className="menu menu-horizontal px-1">
          {!user ? (
            <>
              <li>
                <Link to="/register">Inscription</Link>
              </li>
              <li>
                <Link to="/login">Connexion</Link>
              </li>
            </>
          ) : (
            <li>
              <div className="flex justify-between items-center gap-4 text-blue-500">
                <button
                  onClick={() => setIsTagsOpen(true)}
                  className="btn btn-sm btn-ghost gap-2"
                >
                  <FaTags /> Gérer les tags
                </button>
                <div className="divider divider-horizontal mx-0"></div>
                <span className="font-bold">Welcome, {user.username}</span>
                <button onClick={logout} className="btn btn-sm btn-error">Déconnexion</button>
              </div>
            </li>
          )}
        </ul>
      </div>

      {isTagsOpen && (
        <ModalTagManager
          isOpen={isTagsOpen}
          onRequestClose={() => setIsTagsOpen(false)}
        />
      )}
    </nav>
  );
}

export default Navbar;
