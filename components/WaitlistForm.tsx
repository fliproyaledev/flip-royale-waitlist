'use client';

import { useState } from 'react';
import { validateTwitterUsername, validateWalletAddress } from '@/lib/validation';
import styles from './WaitlistForm.module.css';

export default function WaitlistForm() {
    const [twitterUsername, setTwitterUsername] = useState('');
    const [walletAddress, setWalletAddress] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const [twitterError, setTwitterError] = useState('');
    const [walletError, setWalletError] = useState('');

    const handleTwitterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setTwitterUsername(value);

        if (value) {
            const validation = validateTwitterUsername(value);
            setTwitterError(validation.isValid ? '' : validation.error || '');
        } else {
            setTwitterError('');
        }
    };

    const handleWalletChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setWalletAddress(value);

        if (value) {
            const validation = validateWalletAddress(value);
            setWalletError(validation.isValid ? '' : validation.error || '');
        } else {
            setWalletError('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        // Final validation
        const twitterValidation = validateTwitterUsername(twitterUsername);
        const walletValidation = validateWalletAddress(walletAddress);

        if (!twitterValidation.isValid) {
            setTwitterError(twitterValidation.error || 'Invalid Twitter username');
            return;
        }

        if (!walletValidation.isValid) {
            setWalletError(walletValidation.error || 'Invalid wallet address');
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await fetch('/api/waitlist', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    twitter_username: twitterUsername,
                    wallet_address: walletAddress,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setMessage({ type: 'success', text: data.message });
                setTwitterUsername('');
                setWalletAddress('');
                setTwitterError('');
                setWalletError('');
            } else {
                setMessage({ type: 'error', text: data.message });
            }
        } catch (error) {
            setMessage({
                type: 'error',
                text: 'Network error. Please check your connection and try again.',
            });
            console.error('Submission error:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.formContainer}>
            <h2 className={styles.formTitle}>Join the Waitlist</h2>
            <p className={styles.formSubtitle}>
                Be among the first to experience Flip Royale and compete for exclusive rewards
            </p>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.inputGroup}>
                    <label htmlFor="twitter" className={styles.label}>
                        X (Twitter) Username
                    </label>
                    <input
                        type="text"
                        id="twitter"
                        value={twitterUsername}
                        onChange={handleTwitterChange}
                        placeholder="@username"
                        className={`${styles.input} ${twitterError ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                        required
                    />
                    {twitterError && <p className={styles.errorText}>{twitterError}</p>}
                </div>

                <div className={styles.inputGroup}>
                    <label htmlFor="wallet" className={styles.label}>
                        ERC20 Wallet Address
                    </label>
                    <input
                        type="text"
                        id="wallet"
                        value={walletAddress}
                        onChange={handleWalletChange}
                        placeholder="0x..."
                        className={`${styles.input} ${walletError ? styles.inputError : ''}`}
                        disabled={isSubmitting}
                        required
                    />
                    {walletError && <p className={styles.errorText}>{walletError}</p>}
                </div>

                <button
                    type="submit"
                    disabled={isSubmitting || !!twitterError || !!walletError}
                    className={styles.submitButton}
                >
                    {isSubmitting ? (
                        <span className={styles.loadingSpinner}>
                            <span className={styles.spinner}></span>
                            Joining...
                        </span>
                    ) : (
                        'Join Waitlist'
                    )}
                </button>

                {message && (
                    <div className={`${styles.message} ${styles[message.type]}`}>
                        {message.text}
                    </div>
                )}
            </form>
        </div>
    );
}
