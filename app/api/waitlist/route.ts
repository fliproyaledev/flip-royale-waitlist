import { NextRequest, NextResponse } from 'next/server';
import { insertWaitlistEntry } from '@/lib/db';
import { validateTwitterUsername, validateWalletAddress } from '@/lib/validation';
import { ApiResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
    try {
        // Parse request body
        const body = await request.json();
        const { twitter_username, wallet_address } = body;

        // Validate Twitter username
        const twitterValidation = validateTwitterUsername(twitter_username);
        if (!twitterValidation.isValid) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: twitterValidation.error || 'Invalid Twitter username',
                },
                { status: 400 }
            );
        }

        // Validate wallet address
        const walletValidation = validateWalletAddress(wallet_address);
        if (!walletValidation.isValid) {
            return NextResponse.json<ApiResponse>(
                {
                    success: false,
                    message: walletValidation.error || 'Invalid wallet address',
                },
                { status: 400 }
            );
        }

        // Insert into database
        try {
            const entry = await insertWaitlistEntry(
                twitterValidation.cleaned,
                walletValidation.cleaned
            );

            return NextResponse.json<ApiResponse>(
                {
                    success: true,
                    message: 'Successfully joined the waitlist!',
                    data: entry,
                },
                { status: 201 }
            );
        } catch (dbError: unknown) {
            // Handle duplicate entries
            if (dbError instanceof Error) {
                if (
                    dbError.message.includes('already registered') ||
                    dbError.message.includes('unique constraint')
                ) {
                    return NextResponse.json<ApiResponse>(
                        {
                            success: false,
                            message: dbError.message,
                        },
                        { status: 409 } // Conflict
                    );
                }
            }

            // Other database errors
            throw dbError;
        }
    } catch (error) {
        console.error('Waitlist API error:', error);
        return NextResponse.json<ApiResponse>(
            {
                success: false,
                message: 'An unexpected error occurred. Please try again later.',
            },
            { status: 500 }
        );
    }
}
