import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import { useAuth } from "../context/AuthContext.jsx";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { login, loading } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await login(email, password);
            navigate("/home");
        } catch (err) {
            setError(err.message || "Invalid email or password");
        }
    };

    return (
        <div className="login-page">
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <div className="logo-section">
                            <img src="/logoMBDS.png" alt="Logo MBDS" className="login-logo" />
                        </div>
                        <h2>Connexion</h2>
                        <p>Accédez à votre compte</p>
                    </div>
                    
                    {error && (
                        <div className="error-message">
                            <span className="error-icon">⚠️</span>
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="login-form">
                        <div className="input-group">
                            <label htmlFor="email">Adresse email</label>
                            <div className="input-wrapper">
                                <span className="input-icon">📧</span>
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="votre.email@exemple.com"
                                    required
                                />
                            </div>
                        </div>
                        
                        <div className="input-group">
                            <label htmlFor="password">Mot de passe</label>
                            <div className="input-wrapper">
                                <span className="input-icon">🔒</span>
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Votre mot de passe"
                                    required
                                />
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="login-button"
                        >
                            {loading ? (
                                <>
                                    <span className="loading-spinner"></span>
                                    Connexion en cours...
                                </>
                            ) : (
                                <>
                                    <span className="button-icon">🚀</span>
                                    Se connecter
                                </>
                            )}
                        </button>
                    </form>
                    
                    <div className="login-footer">
                        <p>Plateforme de Gestion Académique MBDS</p>
                    </div>
                </div>
            </div>
        </div>
    );
}