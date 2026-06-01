import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { MOCK_MENU } from '@/lib/mock-data'

export async function GET() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      console.error('Error fetching menu items from Supabase:', error)
      // Fallback to mock data if table is not configured or throws error
      return NextResponse.json(MOCK_MENU)
    }

    // If database is empty, return mock data
    if (!data || data.length === 0) {
      return NextResponse.json(MOCK_MENU)
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error('Server error fetching menu:', error)
    return NextResponse.json(MOCK_MENU)
  }
}
