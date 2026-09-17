import { NextResponse } from 'next/server';
import Razorpay from 'razorpay';

export async function POST(request: Request) {
  try {
    const keyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;
    const keySecret = process.env.RAZORPAY_KEY_SECRET;

    if (!keyId || keyId.includes('xxxxxxxx') || !keySecret || keySecret.includes('xxxxxxxx')) {
      return NextResponse.json(
        { error: 'Razorpay API keys are not configured properly in environment variables.' },
        { status: 400 }
      );
    }

    const razorpay = new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });

    const { amount, planTier } = await request.json();

    if (!amount || amount <= 0) {
      return NextResponse.json({ error: 'Invalid amount' }, { status: 400 });
    }

    const options = {
      amount: Math.round(amount * 100), // Amount in paise
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`,
      notes: {
        planTier: planTier || 'growth',
      },
    };

    const order = await razorpay.orders.create(options);

    return NextResponse.json({
      id: order.id,
      currency: order.currency,
      amount: order.amount,
      keyId: keyId,
    });
  } catch (error: any) {
    console.error('Razorpay order creation error:', error);
    const errorMessage = error?.error?.description || error?.description || error?.message || 'Failed to create Razorpay order';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}
