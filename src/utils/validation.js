/**
 * Input validation utilities
 */

export const validateStoryInput = (input) => {
    const errors = [];

    if (!input || typeof input !== 'string') {
        errors.push('Geçerli bir metin girmelisiniz');
        return { isValid: false, errors };
    }

    const trimmed = input.trim();

    if (trimmed.length < 10) {
        errors.push('Lütfen en az 10 karakter girin');
    }

    if (trimmed.length > 5000) {
        errors.push('Metin çok uzun (maksimum 5000 karakter)');
    }

    return {
        isValid: errors.length === 0,
        errors,
        sanitized: trimmed
    };
};

export const sanitizeHTML = (str) => {
    if (!str) return '';
    const temp = document.createElement('div');
    temp.textContent = str;
    return temp.innerHTML;
};

export const validateXPAmount = (amount) => {
    return typeof amount === 'number' && amount > 0 && amount <= 10000;
};

export const validateLevel = (level) => {
    return typeof level === 'number' && level >= 1 && level <= 100;
};
