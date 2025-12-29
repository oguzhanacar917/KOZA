export const APP_CONFIG = {
    NAME: "KOZA",
    VERSION: "2.0.0"
};

export const API_CONFIG = {
    GEMINI_API_KEY: import.meta.env.VITE_GEMINI_API_KEY || "AIzaSyDITPa_2fG8x6aUjZ8DsA_f9l3AdWA7ToQ"
};

export const FIREBASE_CONFIG = {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
    appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

export const ANALYTICS_CONFIG = {
    measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || ""
};
