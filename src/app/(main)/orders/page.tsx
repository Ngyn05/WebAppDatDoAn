'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/mock-data'
import { createClient } from '@/lib/supabase/client'
import styles from './orders.module.css'

interface OrderItem {
  id: string
  quantity: number
}

interface DBOrder {
  id: string
  total_amount: number
  order_status: string
  payment_method: string
  payment_status: string
  created_at: string
  order_items?: OrderItem[]
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'Chờ xác nhận', class: 'badge-warning' },
  confirmed: { label: 'Chờ giao hàng', class: 'badge-primary' },
  delivering: { label: 'Đang giao', class: 'badge-primary' },
  done: { label: 'Hoàn thành', class: 'badge-success' },
  cancelled: { label: 'Đã hủy', class: 'badge-error' },
}

const PAYMENT_MAP: Record<string, string> = {
  cod: '💵 COD',
  zalopay: '📱 ZaloPay',
  momo: '💳 MoMo',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<DBOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchOrders() {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        
        if (!user) {
          setOrders([])
          setLoading(false)
          return
        }

        const { data, error } = await supabase
          .from('orders')
          .select('*, order_items(id, quantity)')
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching orders:', error)
        } else {
          setOrders(data || [])
        }
      } catch (err) {
        console.error('Failed to fetch orders:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [])

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Đơn hàng của tôi 📋</h1>
        <p className="page-subtitle">
          {orders.length > 0
            ? `Bạn có ${orders.length} đơn hàng`
            : 'Theo dõi tình trạng đơn hàng'}
        </p>

        {loading ? (
          <div className={styles.loadingState}>
            {[1, 2, 3].map((i) => (
              <div key={i} className={`card ${styles.orderSkeleton}`}>
                <div className="skeleton" style={{ width: '40%', height: 20, marginBottom: 12 }} />
                <div className="skeleton" style={{ width: '60%', height: 16, marginBottom: 8 }} />
                <div className="skeleton" style={{ width: '30%', height: 16 }} />
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>📋</span>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Hãy đặt món ăn đầu tiên của bạn!</p>
            <Link href="/menu" className="btn btn-primary" style={{ marginTop: 16 }}>
              🍽️ Xem menu
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => {
              const status = STATUS_MAP[order.order_status] || STATUS_MAP.pending
              return (
                <div key={order.id} className={`card ${styles.orderCard}`}>
                  <div className={styles.orderHeader}>
                    <div>
                      <h3 className={styles.orderId}>{order.id}</h3>
                      <span className={styles.orderDate}>
                        {new Date(order.created_at).toLocaleString('vi-VN')}
                      </span>
                    </div>
                    <span className={`badge ${status.class}`}>{status.label}</span>
                  </div>
                  <div className="divider" />
                  <div className={styles.orderBody}>
                    <div className={styles.orderInfo}>
                      <span>📦 {order.order_items ? order.order_items.reduce((sum, item) => sum + item.quantity, 0) : 0} món</span>
                      <span>{PAYMENT_MAP[order.payment_method] || order.payment_method}</span>
                    </div>
                    <div className={styles.orderTotal}>
                      {formatPrice(order.total_amount)}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
