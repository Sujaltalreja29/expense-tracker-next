import dbConnect from '@/lib/dbConnect';
import {Transaction} from '@/models/model';

export async function POST(request:Request) {
    try {
      const body = await request.json();
      const user = body?.user;

      if (!user) {
        return Response.json(
          { success: false, message: 'User is required' },
          { status: 400 }
        );
      }

      await dbConnect();
      const transactions = await Transaction.find({user});
      // let filter = await data.map(v => Object.assign({}, { type: v.type, color: v.color }));
      return Response.json({
        success: true,
        data: transactions,
          },
          { status: 200 });
    } catch (error) {
      console.error('Error getting transactions:', error);
      return Response.json(
        {
          success: false,
          message: error instanceof SyntaxError
            ? 'Request body must be valid JSON'
            : 'Error getting transactions',
        },
        { status: error instanceof SyntaxError ? 400 : 500 })
    }
  }