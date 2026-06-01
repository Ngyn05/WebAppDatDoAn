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

    const body = await request.json()
    const { order_id, amount, payment_method } = body

    if (!order_id || !amount || !payment_method) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 })
    }

    // [US-06] ZaloPay/MoMo Sandbox creation simulation
    // In real app, we send request to ZaloPay/MoMo APIs with HMACSIGNATURE
    // e.g., signature = HMAC_SHA256(key, appid + "|" + apptransid + "|" + appuser + "|" + amount + "|" + apptime + "|" + embeddata + "|" + item)
    console.log(`Creating payment session for order ${order_id} via ${payment_method} with amount ${amount}`)
    
    // Simulate generating redirect URL (payUrl) to our premium mock payment screen
    const payUrl = `/payment?method=${payment_method}`

    return NextResponse.json({ 
      success: true, 
      payment_method,
      amount,
      payUrl 
    })
  } catch (error: any) {
    console.error('Error creating payment link:', error)
    return NextResponse.json({ error: 'Internal Server Error', details: error.message }, { status: 500 })
  }
}
