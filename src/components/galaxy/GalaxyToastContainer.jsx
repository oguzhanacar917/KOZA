import React from 'react';
import { useUI } from '../../context/UIContext';
import GalaxyToast from './GalaxyToast';
import './GalaxyToast.css'; // Re-use CSS

const GalaxyToastContainer = () => {
    const { toasts, setToasts } = useUI(); // Ensure setToasts is exposed in UIContext or handle removal via addToast logic if possible

    // Assuming UIContext handles removal via timeout, but we need manual close too.
    // If UIContext doesn't expose a removeToast method, we might need to modify UIContext or rely on auto-close.
    // Looking at UIContext.jsx: 
    // const [toasts, setToasts] = useState([]);
    // addToast adds and sets timeout.
    // It does NOT expose removeToast directly, but it exposes setToasts.

    const removeToast = (id) => { // Manually remove
        setToasts(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div className="galaxy-toast-container">
            {toasts.map(toast => (
                <GalaxyToast
                    key={toast.id}
                    title={toast.title}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default GalaxyToastContainer;
