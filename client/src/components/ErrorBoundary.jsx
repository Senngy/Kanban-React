import React from 'react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        // Mettre à jour l'état pour que le prochain rendu affiche l'UI de remplacement.
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // On peut aussi enregistrer l'erreur dans un service de rapport d'erreurs (Sentry, etc.)
        console.error("ErrorBoundary caught an error:", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            // UI de secours personnalisée
            return (
                <div className="flex flex-col items-center justify-center min-h-screen bg-slate-900 text-white p-6 text-center">
                    <h1 className="text-4xl font-bold mb-4">Oups ! Quelque chose s'est mal passé.</h1>
                    <p className="text-gray-400 mb-6">
                        Une erreur inattendue est survenue dans l'interface.
                    </p>
                    <div className="bg-red-900/20 border border-red-500 p-4 rounded-lg mb-6 max-w-2xl overflow-auto">
                        <code className="text-red-400 text-sm">
                            {this.state.error && this.state.error.toString()}
                        </code>
                    </div>
                    <button
                        onClick={() => window.location.reload()}
                        className="glass-button px-6 py-2 rounded-lg"
                    >
                        Recharger l'application
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
