/**
 * Validates Twitter/X username
 * - Removes @ symbol if present
 * - Checks length (1-15 characters)
 * - Allows alphanumeric and underscore only
 */
export function validateTwitterUsername(username: string): {
    isValid: boolean;
    cleaned: string;
    error?: string;
} {
    // Remove @ symbol if present
    const cleaned = username.trim().replace(/^@/, '');

    if (!cleaned) {
        return { isValid: false, cleaned: '', error: 'Twitter username is required' };
    }

    if (cleaned.length < 1 || cleaned.length > 15) {
        return {
            isValid: false,
            cleaned,
            error: 'Twitter username must be between 1 and 15 characters',
        };
    }

    // Twitter usernames allow alphanumeric and underscore
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(cleaned)) {
        return {
            isValid: false,
            cleaned,
            error: 'Twitter username can only contain letters, numbers, and underscores',
        };
    }

    return { isValid: true, cleaned };
}

/**
 * Validates Ethereum ERC20 wallet address
 * - Must start with 0x
 * - Must be 42 characters total (0x + 40 hex characters)
 * - Must contain only valid hex characters
 */
export function validateWalletAddress(address: string): {
    isValid: boolean;
    cleaned: string;
    error?: string;
} {
    const cleaned = address.trim();

    if (!cleaned) {
        return { isValid: false, cleaned: '', error: 'Wallet address is required' };
    }

    // Must start with 0x
    if (!cleaned.startsWith('0x')) {
        return {
            isValid: false,
            cleaned,
            error: 'Wallet address must start with 0x',
        };
    }

    // Must be exactly 42 characters (0x + 40 hex chars)
    if (cleaned.length !== 42) {
        return {
            isValid: false,
            cleaned,
            error: 'Wallet address must be 42 characters long (0x + 40 hex digits)',
        };
    }

    // Must contain only valid hex characters after 0x
    const hexRegex = /^0x[a-fA-F0-9]{40}$/;
    if (!hexRegex.test(cleaned)) {
        return {
            isValid: false,
            cleaned,
            error: 'Wallet address contains invalid characters (must be hexadecimal)',
        };
    }

    return { isValid: true, cleaned: cleaned.toLowerCase() };
}
