// /app/api/create-transaction/route.ts
import dbConnect from '@/lib/dbConnect';
import { Transaction } from '@/models/model';

export async function POST(request: Request) {
  await dbConnect();

  try {
    const { name, type, amount, user, color, description, date } = await request.json();

    // Basic server-side validation
    if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 200) {
      return Response.json({ success: false, message: 'Invalid transaction name' }, { status: 400 });
    }

    const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
    if (Number.isNaN(parsedAmount) || !isFinite(parsedAmount)) {
      return Response.json({ success: false, message: 'Invalid amount' }, { status: 400 });
    }

    // Enforce sensible amount limits and two-decimal precision
    const AMOUNT_MIN = 0.01;
    const AMOUNT_MAX = 10000000; // 10 million
    if (parsedAmount < AMOUNT_MIN || parsedAmount > AMOUNT_MAX) {
      return Response.json({ success: false, message: `Amount must be between ${AMOUNT_MIN} and ${AMOUNT_MAX}` }, { status: 400 });
    }

    const safeAmount = Math.round(parsedAmount * 100) / 100;

    // Validate user id presence
    if (!user) {
      return Response.json({ success: false, message: 'Missing user ID' }, { status: 400 });
    }

    const Create = new Transaction({
      name: name.trim(),
      type,
      amount: safeAmount,
      user,
      color,
      description: description || '',
      date: date ? new Date(date) : new Date(),
    });

    await Create.save();

    return Response.json({ success: true, message: 'Transaction Created' }, { status: 200 });
  } catch (error) {
    console.error('Error creating Transaction:', error);
    return Response.json({
      success: false,
      message: 'Error creating Transaction',
    }, { status: 500 });
  }
}