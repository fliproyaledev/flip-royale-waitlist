import { Redis } from '@upstash/redis';
import { WaitlistEntry } from './types';

// Initialize Upstash Redis client
const redis = new Redis({
    url: process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || '',
    token: process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

/**
 * Insert a new waitlist entry into Redis
 * Uses Redis Sets and Hash Maps for efficient duplicate checking
 * 
 * Data structure:
 * - waitlist:twitter:{username} -> JSON of entry
 * - waitlist:wallet:{address} -> JSON of entry  
 * - waitlist:all -> SET of all twitter usernames
 */
export async function insertWaitlistEntry(
    twitterUsername: string,
    walletAddress: string
): Promise<WaitlistEntry> {
    try {
        // Check if Twitter username already exists
        const existingTwitter = await redis.get(`waitlist:twitter:${twitterUsername}`);
        if (existingTwitter) {
            throw new Error('This Twitter username is already registered');
        }

        // Check if wallet address already exists
        const existingWallet = await redis.get(`waitlist:wallet:${walletAddress}`);
        if (existingWallet) {
            throw new Error('This wallet address is already registered');
        }

        // Create entry object
        const entry: WaitlistEntry = {
            twitter_username: twitterUsername,
            wallet_address: walletAddress,
            created_at: new Date(),
        };

        // Store in Redis (use pipeline for atomicity)
        const pipeline = redis.pipeline();

        // Store by Twitter username
        pipeline.set(`waitlist:twitter:${twitterUsername}`, JSON.stringify(entry));

        // Store by wallet address
        pipeline.set(`waitlist:wallet:${walletAddress}`, JSON.stringify(entry));

        // Add to set of all usernames
        pipeline.sadd('waitlist:all', twitterUsername);

        // Execute all commands atomically
        await pipeline.exec();

        return entry;
    } catch (error: unknown) {
        // Re-throw our custom errors
        if (error instanceof Error && error.message.includes('already registered')) {
            throw error;
        }

        // Log and throw other errors
        console.error('Redis insert error:', error);
        throw new Error('Failed to insert waitlist entry');
    }
}

/**
 * Get total count of waitlist entries
 */
export async function getWaitlistCount(): Promise<number> {
    try {
        const count = await redis.scard('waitlist:all');
        return count || 0;
    } catch (error) {
        console.error('Error getting waitlist count:', error);
        return 0;
    }
}

/**
 * Get all waitlist entries (for admin use)
 * Note: Use with caution on large datasets
 */
export async function getAllWaitlistEntries(): Promise<WaitlistEntry[]> {
    try {
        // Get all usernames from the set
        const usernames = await redis.smembers('waitlist:all');

        if (!usernames || usernames.length === 0) {
            return [];
        }

        // Fetch all entries
        const entries: WaitlistEntry[] = [];
        for (const username of usernames) {
            const data = await redis.get(`waitlist:twitter:${username}`);
            if (data && typeof data === 'string') {
                entries.push(JSON.parse(data));
            }
        }

        return entries;
    } catch (error) {
        console.error('Error getting all entries:', error);
        return [];
    }
}

/**
 * Check if a Twitter username exists
 */
export async function checkTwitterExists(username: string): Promise<boolean> {
    try {
        const exists = await redis.exists(`waitlist:twitter:${username}`);
        return exists === 1;
    } catch (error) {
        console.error('Error checking Twitter existence:', error);
        return false;
    }
}

/**
 * Check if a wallet address exists
 */
export async function checkWalletExists(address: string): Promise<boolean> {
    try {
        const exists = await redis.exists(`waitlist:wallet:${address}`);
        return exists === 1;
    } catch (error) {
        console.error('Error checking wallet existence:', error);
        return false;
    }
}
