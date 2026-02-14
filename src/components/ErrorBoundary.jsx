import React from 'react';
import { AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
                    <div className="max-w-md w-full bg-white rounded-2xl border border-neutral-200 p-8 text-center">
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <AlertTriangle size={32} className="text-red-600" />
                        </div>
                        <h2 className="text-2xl font-bold mb-2">Bir Hata Oluştu</h2>
                        <p className="text-neutral-600 mb-6">
                            Üzgünüz, beklenmeyen bir sorun oluştu. Lütfen sayfayı yenileyin.
                        </p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
                        >
                            Sayfayı Yenile
                        </button>
                    </div>
                    {this.state.error && (
                        <div className="mt-8 max-w-2xl mx-auto p-4 bg-red-50 rounded-lg border border-red-100 text-left overflow-auto">
                            <p className="font-mono text-sm text-red-700 whitespace-pre-wrap">
                                {this.state.error.toString()}
                            </p>
                            {this.state.errorInfo && (
                                <pre className="mt-2 font-mono text-xs text-red-600 whitespace-pre-wrap">
                                    {this.state.errorInfo.componentStack}
                                </pre>
                            )}
                        </div>
                    )}
                </div>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
