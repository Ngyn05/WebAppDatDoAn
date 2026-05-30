import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  try {
    const supabase = await createClient()

    // 1. Check user authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // 2. Parse request body
    const body = await request.json()
    const { customer_name, phone, address, note, payment_method, total_amount, items } = body

    if (!customer_name || !phone || !address || !total_amount || !items || !Array.isArray(items)) {
      return NextResponse.json({ error: 'Missing required fields or invalid items data' }, { status: 400 })
    }

    // 3. Start Transaction-like flow (Insert order first)
    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        customer_name,
        phone,
        address,
        note,
        total_amount,
        payment_method,
        payment_status: payment_method === 'cod' ? 'pending' : 'pending', // Pending initially for online payment
        order_status: 'pending',
      })
      .select()
      .single()

    if (orderError) {
      console.error('Error inserting order:', orderError)
      return NextResponse.json({ error: 'Failed to create order', details: orderError.message }, { status: 500 })
    }

    const orderId = orderData.id

    // 4. Prepare order items data
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: orderId,
      menu_item_id: item.id.length === 36 ? item.id : null, // Check if it is a valid UUID, otherwise set null for custom items
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.image_url || '',
    }))

    // 5. Insert order items
    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert)

    if (itemsError) {
      console.error('Error inserting order items:', itemsError)
      // Rollback order if items fail
      await supabase.from('orders').delete().eq('id', orderId)
      return NextResponse.json({ error: 'Failed to save order details', details: itemsError.message }, { status: 500 })
    }

    return NextResponse.json({ success: true, order: orderData })
  } catch (error: any) {
    console.error('Server error creating order:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
