export interface MenuItem {
  id: string
  name: string
  description: string
  price: number
  image_url: string
  category: string
  is_available: boolean
  created_at?: string
}

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image_url: string
}

export interface Order {
  id: string
  user_id: string
  items: CartItem[]
  total_amount: number
  customer_name: string
  phone: string
  address: string
  note?: string
  payment_method: 'zalopay' | 'momo' | 'cod'
  payment_status: 'pending' | 'paid' | 'failed'
  order_status: 'pending' | 'confirmed' | 'delivering' | 'done' | 'cancelled'
  created_at: string
}

export interface DeliveryInfo {
  customer_name: string
  phone: string
  address: string
  note?: string
}

export type PaymentMethod = 'zalopay' | 'momo' | 'cod'
