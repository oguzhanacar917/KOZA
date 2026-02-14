import { useState, useEffect, useCallback, useRef } from 'react';

const useAudioStory = (text, lang = 'tr-TR') => {
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [supported, setSupported] = useState(false);
    const utteranceRef = useRef(null);

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setSupported(true);
        }
    }, []);

    // Cleanup on unmount or text change
    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel();
        };
    }, []);

    const getVoice = useCallback(() => {
        const voices = window.speechSynthesis.getVoices();
        // Try to find a Turkish voice
        return voices.find(v => v.lang.startsWith(lang)) || voices[0];
    }, [lang]);

    const speak = useCallback(() => {
        if (!supported || !text) return;

        // Cancel any current speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = lang;
        utterance.voice = getVoice();
        utterance.rate = 0.9; // Slightly slower for better storytelling
        utterance.pitch = 1.0;

        utterance.onstart = () => {
            setIsSpeaking(true);
            setIsPaused(false);
        };

        utterance.onend = () => {
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utterance.onerror = (e) => {
            console.error("Speech error", e);
            setIsSpeaking(false);
            setIsPaused(false);
        };

        utteranceRef.current = utterance;
        window.speechSynthesis.speak(utterance);
    }, [text, lang, supported, getVoice]);

    const pause = useCallback(() => {
        if (window.speechSynthesis.speaking) {
            window.speechSynthesis.pause();
            setIsPaused(true);
            setIsSpeaking(false); // Visually paused
        }
    }, []);

    const resume = useCallback(() => {
        if (window.speechSynthesis.paused) {
            window.speechSynthesis.resume();
            setIsPaused(false);
            setIsSpeaking(true);
        } else if (!isSpeaking && !isPaused) {
            // If stopped fully, restart
            speak();
        }
    }, [speak, isSpeaking, isPaused]);

    const stop = useCallback(() => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
        setIsPaused(false);
    }, []);

    const toggle = useCallback(() => {
        if (isSpeaking) {
            pause();
        } else {
            resume();
        }
    }, [isSpeaking, pause, resume]);

    return {
        speak,
        pause,
        resume,
        stop,
        toggle,
        isSpeaking, // actively talking
        isPaused,   // paused state
        supported
    };
};

export default useAudioStory;
