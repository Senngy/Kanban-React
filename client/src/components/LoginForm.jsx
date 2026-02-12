import { useState } from "react";
import { useAuth } from "../lib/hooks/useAuth";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ username: email, password }); // Note: Field is 'email' in state but 'username' for backend
      toast.success("Connexion réussie !");
      // Navigation is handled by App.jsx observing user state
    } catch (err) {
      console.error(err);
      toast.error("Identifiants incorrects ou serveur indisponible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col gap-4 max-w-md mx-auto p-8 glass-panel mt-20 animate-fade-in"
    >
      <h2 className="text-xl font-bold text-center">Connexion</h2>
      
      <div className="form-control">
        <input
          type="text"
          placeholder="Nom d'utilisateur / Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="glass-input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div className="form-control relative">
        <input
          type={showPassword ? "text" : "password"}
          placeholder="Mot de passe"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="glass-input input-bordered w-full"
          required
          disabled={loading}
        />
        <button
          type="button"
          className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex="-1"
        >
          {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
        </button>
      </div>

      <button 
        type="submit" 
        className="glass-button w-full py-2 rounded-lg text-primary hover:text-white hover:bg-primary/80"
        disabled={loading}
      >
        {loading ? <span className="loading loading-spinner"></span> : "Se connecter"}
      </button>

      <div className="text-center mt-2">
        <Link to="/register" className="link link-hover text-sm">
          Pas encore de compte ? M'inscrire
        </Link>
      </div>
    </form>
  );
}