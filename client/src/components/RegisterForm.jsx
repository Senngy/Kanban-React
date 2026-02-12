import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../lib/hooks/useAuth";
import toast from "react-hot-toast";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function RegisterForm() {
  const { register } = useAuth();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Real-time validation
  const [isValid, setIsValid] = useState(false);
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    setIsValid(password.length >= 8); // Backend requirement
  }, [password]);

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!isValid) return;
    
    setLoading(true);
    try {
      await register({ 
        username, 
        password, 
        email, 
        first_name: firstName, 
        last_name: lastName, 
        role: "user" 
      });
      toast.success("Inscription réussie !");
      // Navigation is handled by App.jsx observing user state
    } catch (err) {
      console.error(err);
      toast.error(err.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="flex flex-col gap-4 max-w-md mx-auto p-8 glass-panel mt-10 animate-fade-in"
    >
      <h2 className="text-xl font-bold text-center">Inscription</h2>
      
      <div className="form-control">
        <input
          type="text"
          placeholder="Prénom"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          className="glass-input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <input
          type="text"
          placeholder="Nom"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          className="glass-input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="glass-input input-bordered w-full"
          required
          disabled={loading}
        />
      </div>

      <div className="form-control">
        <input
          type="text"
          placeholder="Nom d'utilisateur"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
          onChange={(e) => {
            setPassword(e.target.value);
            setTouched(true);
          }}
          className={`glass-input input-bordered w-full ${touched && !isValid ? "input-error" : ""}`}
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
      
      {touched && !isValid && (
        <p className="text-xs text-error mt-0">
          Le mot de passe doit contenir au moins 8 caractères.
        </p>
      )}

      <button 
        type="submit" 
        className="glass-button w-full py-2 rounded-lg text-primary hover:text-white hover:bg-primary/80"
        disabled={loading || !isValid}
      >
        {loading ? <span className="loading loading-spinner"></span> : "S'inscrire"}
      </button>

      <div className="text-center mt-2">
        <Link to="/login" className="link link-hover text-sm">
          Déjà un compte ? Se connecter
        </Link>
      </div>
    </form>
  );
}
