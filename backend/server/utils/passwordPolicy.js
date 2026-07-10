const MIN_LENGTH = 8;
const MAX_LENGTH = 128;

/**
 * Validates password strength for register, reset, and change flows.
 * @returns {{ ok: true } | { ok: false, message: string }}
 */
function validatePassword(password) {
    const value = String(password || '');

    if (value.length < MIN_LENGTH) {
        return { ok: false, message: `Password must be at least ${MIN_LENGTH} characters.` };
    }
    if (value.length > MAX_LENGTH) {
        return { ok: false, message: `Password must be at most ${MAX_LENGTH} characters.` };
    }
    if (!/[a-zA-Z]/.test(value)) {
        return { ok: false, message: 'Password must include at least one letter.' };
    }
    if (!/[0-9]/.test(value)) {
        return { ok: false, message: 'Password must include at least one number.' };
    }
    if (/\s/.test(value)) {
        return { ok: false, message: 'Password must not contain spaces.' };
    }

    return { ok: true };
}

module.exports = { validatePassword, MIN_LENGTH, MAX_LENGTH };
