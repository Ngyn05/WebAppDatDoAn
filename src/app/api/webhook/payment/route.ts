import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// Mock Webhook endpoint from ZaloPay / MoMo
export async function POST(request: Request) {
  try {
    const supabase = await createClient()
    const body = await request.json()
    const { order_id, payment_status, signature } = body

    if (!order_id || !payment_status) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // [US-07] Verify payment signature simulation
    // In real app, we check: crypto.createHmac('sha256', key).update(data).digest('hex') === signature
    if (signature && signature !== 'mock_valid_signature') {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    console.log(`Webhook received: Order ${order_id} is ${payment_status}`)

    // Update order status in Supabase Database
    const { data, error } = await supabase
      .from('orders')
      .update({
        payment_status: payment_status === 'success' || payment_status === 'paid' ? 'paid' : 'failed',
        order_status: payment_status === 'success' || payment_status === 'paid' ? 'confirmed' : 'pending',
      })
      .eq('id', order_id)
      .select()

    if (error) {
      console.error('Webhook database update error:', error)
      return NextResponse.json({ error: 'Failed to update order status', details: error.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Order status updated successfully via Webhook',
      updated_order: data 
    })
  } catch (error: any) {
    console.error('Webhook internal error:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
