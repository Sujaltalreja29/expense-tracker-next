import dbConnect from '@/lib/dbConnect';
import { Transaction } from '@/models/model';
import mongoose from 'mongoose';

export async function PATCH(request: Request) {
  await dbConnect();

  try {
    const { id, name, type, amount, color, description, date, user } = await request.json();

    if (!id || typeof id !== 'string' || !mongoose.Types.ObjectId.isValid(id)) {
      return Response.json({ success: false, message: 'Invalid or missing transaction id' }, { status: 400 });
    }

    // Validate optional fields
    if (name !== undefined) {
      if (!name || typeof name !== 'string' || name.trim().length === 0 || name.trim().length > 200) {
        return Response.json({ success: false, message: 'Invalid transaction name' }, { status: 400 });
      }
    }

    let safeAmount: number | undefined = undefined;
    if (amount !== undefined) {
      const parsedAmount = typeof amount === 'string' ? parseFloat(amount) : Number(amount);
      if (Number.isNaN(parsedAmount) || !isFinite(parsedAmount)) {
        return Response.json({ success: false, message: 'Invalid amount' }, { status: 400 });
      }
      const AMOUNT_MIN = 0.01;
      const AMOUNT_MAX = 10000000;
      if (parsedAmount < AMOUNT_MIN || parsedAmount > AMOUNT_MAX) {
        return Response.json({ success: false, message: `Amount must be between ${AMOUNT_MIN} and ${AMOUNT_MAX}` }, { status: 400 });
      }
      safeAmount = Math.round(parsedAmount * 100) / 100;
    }

    // Fetch existing transaction
    const existing = await Transaction.findById(id);
    if (!existing) {
      return Response.json({ success: false, message: 'Transaction not found' }, { status: 404 });
    }

    // Ownership check if user provided
    if (user) {
      if (existing.user && existing.user.toString() !== String(user)) {
        return Response.json({ success: false, message: 'Not authorized to update this transaction' }, { status: 403 });
      }
    }

    // Build update object
    const update: any = {};
    if (name !== undefined) update.name = name.trim();
    if (type !== undefined) update.type = type;
    if (safeAmount !== undefined) update.amount = safeAmount;
    if (color !== undefined) update.color = color;
    if (description !== undefined) update.description = description;
    if (date !== undefined) update.date = date ? new Date(date) : undefined;

    // Remove undefined keys
    Object.keys(update).forEach((k) => update[k] === undefined && delete update[k]);

    const updated = await Transaction.findByIdAndUpdate(id, update, { new: true });

    return Response.json({ success: true, message: 'Transaction updated', data: updated }, { status: 200 });
  } catch (error) {
    console.error('Error updating transaction:', error);
    return Response.json({ success: false, message: 'Error updating transaction' }, { status: 500 });
  }
}
