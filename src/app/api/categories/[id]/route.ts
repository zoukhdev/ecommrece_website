import { NextRequest, NextResponse } from 'next/server';
import { getCategories } from '../../../../lib/supabase';

// GET /api/categories/[id] - Get a specific category
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const categories = await getCategories();
    const category = categories.find(cat => cat.id === params.id);
    
    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
