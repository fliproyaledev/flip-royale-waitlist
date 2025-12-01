import { sql } from '@vercel/postgres';
import { WaitlistEntry } from './types';

/**
 * Insert a new waitlist entry into the database
 * @throws Error if the entry violates unique constraints or database is not configured
 */
export async function insertWaitlistEntry(
    twitterUsername: string,
    walletAddress: string
): Promise<WaitlistEntry> {
    try {
        const result = await sql`
      INSERT INTO waitlist_entries (twitter_username, wallet_address)
      VALUES (${twitterUsername}, ${walletAddress})
      RETURNING id, twitter_username, wallet_address, created_at
    `;

        if (result.rows.length === 0) {
            throw new Error('Failed to insert waitlist entry');
        }

        return result.rows[0] as WaitlistEntry;
    } catch (error: unknown) {
        // Handle duplicate entry errors
        if (error instanceof Error && error.message.includes('unique constraint')) {
            if (error.message.includes('twitter_username')) {
                throw new Error('This Twitter username is already registered');
            }
            if (error.message.includes('wallet_address')) {
                throw new Error('This wallet address is already registered');
            }
        }

        // Re-throw the error for other cases
        throw error;
    }
}

/**
 * Get total count of waitlist entries
 */
export async function getWaitlistCount(): Promise<number> {
    try {
        const result = await sql`
      SELECT COUNT(*) as count FROM waitlist_entries
    `;
        return Number(result.rows[0].count);
    } catch (error) {
        console.error('Error getting waitlist count:', error);
        return 0;
    }
}

/**
 * Initialize database table (run this during setup)
 * This function creates the table if it doesn't exist
 */
export async function initializeDatabase(): Promise<void> {
    await sql`
    CREATE TABLE IF NOT EXISTS waitlist_entries (
      id SERIAL PRIMARY KEY,
      twitter_username VARCHAR(255) NOT NULL,
      wallet_address VARCHAR(42) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      CONSTRAINT unique_twitter UNIQUE(twitter_username),
      CONSTRAINT unique_wallet UNIQUE(wallet_address)
    )
  `;

    await sql`
    CREATE INDEX IF NOT EXISTS idx_created_at ON waitlist_entries(created_at DESC)
  `;
}
