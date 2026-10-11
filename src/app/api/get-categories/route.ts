import dbConnect from '@/lib/dbConnect';
import {Categories} from '@/models/model';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    await dbConnect();
    const categories = await Categories.find({});
    return Response.json({
      success: true,
      data: categories,
    }, { status: 200 });
  } catch (error) {
    console.error('Error getting categories:', error);
    return Response.json(
      {
        success: false,
        message: 'Error getting categories',
      },
      { status: 500 })
  }
}
