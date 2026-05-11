import { NextResponse } from 'next/server';
import { RPC_URL } from '@/lib/contracts/config';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const response = await fetch(RPC_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorText = await response.text();
      return NextResponse.json(
        { error: `RPC Node error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('[RPC Proxy Error]:', error);
    return NextResponse.json(
      { error: 'Failed to proxy RPC request', details: error.message },
      { status: 500 }
    );
  }
}
