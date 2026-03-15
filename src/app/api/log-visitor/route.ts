import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    // In production (e.g., Vercel, Firebase App Hosting), use 'x-forwarded-for'.
    // In local dev, this might be null.
    const forwarded = req.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0].trim() : req.ip;

    // For local development, req.ip might be '127.0.0.1' or '::1', which ip-api won't resolve.
    // We'll use a fallback public IP for testing purposes if we get a local IP.
    const isLocalIp = ip === '127.0.0.1' || ip === '::1';
    const testIp = '8.8.8.8'; // Google's DNS, a reliable public IP for testing.
    const targetIp = isLocalIp ? testIp : ip;

    if (!targetIp) {
        return NextResponse.json({ error: 'Could not determine IP address.' }, { status: 400 });
    }

    // Fetch data from ip-api.com. Using http as per their free tier docs.
    const response = await fetch(`http://ip-api.com/json/${targetIp}`);
    const data = await response.json();

    if (data.status === 'fail') {
      console.error('ip-api.com failed:', data.message);
      return NextResponse.json({ error: 'Failed to fetch IP data', detail: data.message }, { status: 502 }); // Bad Gateway
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API route /api/log-visitor error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

    