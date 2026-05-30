'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { formatPrice } from '@/lib/mock-data'
import styles from './orders.module.css'

interface MockOrder {
  id: string
  items_count: number
  total_amount: number
  order_status: string
  payment_method: string
  payment_status: string
  created_at: string
}

const STATUS_MAP: Record<string, { label: string; class: string }> = {
  pending: { label: 'Chờ xác nhận', class: 'badge-warning' },
  confirmed: { label: 'Đã xác nhận', class: 'badge-primary' },
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
  const [orders, setOrders] = useState<MockOrder[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading from DB
    setTimeout(() => {
      // Check if there's a recent order in sessionStorage
      const recentOrder = sessionStorage.getItem('current_order')
      const mockOrders: MockOrder[] = []
      
      if (recentOrder) {
        const parsed = JSON.parse(recentOrder)
        mockOrders.push({
          id: parsed.id,
          items_count: parsed.items?.length || 0,
          total_amount: parsed.total_amount,
          order_status: 'confirmed',
          payment_method: parsed.payment_method || 'cod',
          payment_status: 'paid',
          created_at: parsed.created_at || new Date().toISOString(),
        })
      }

      setOrders(mockOrders)
      setLoading(false)
    }, 800)
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
                      <span>📦 {order.items_count} món</span>
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
