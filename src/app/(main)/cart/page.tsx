'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { FOOD_EMOJIS, FOOD_GRADIENTS, MOCK_MENU, formatPrice } from '@/lib/mock-data'
import styles from './cart.module.css'

export default function CartPage() {
  const [mounted, setMounted] = useState(false)
  const items = useCartStore((s) => s.items)
  const updateQuantity = useCartStore((s) => s.updateQuantity)
  const removeItem = useCartStore((s) => s.removeItem)
  const clearCart = useCartStore((s) => s.clearCart)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner spinner-lg" />
          </div>
        </div>
      </div>
    )
  }

  const deliveryFee = items.length > 0 ? 15000 : 0
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Giỏ hàng 🛒</h1>
        <p className="page-subtitle">
          {items.length > 0
            ? `${items.length} món trong giỏ hàng`
            : 'Giỏ hàng trống'}
        </p>

        {items.length === 0 ? (
          <div className={styles.emptyCart}>
            <span className={styles.emptyEmoji}>🛒</span>
            <h3>Giỏ hàng trống</h3>
            <p>Hãy thêm món ăn yêu thích vào giỏ hàng</p>
            <Link href="/menu" className="btn btn-primary" style={{ marginTop: 16 }}>
              🍽️ Xem menu
            </Link>
          </div>
        ) : (
          <div className={styles.cartLayout}>
            {/* Cart Items */}
            <div className={styles.cartItems}>
              {items.map((item) => {
                const menuItem = MOCK_MENU.find((m) => m.id === item.id)
                const gradient = menuItem
                  ? FOOD_GRADIENTS[menuItem.category] || FOOD_GRADIENTS.com
                  : FOOD_GRADIENTS.com

                return (
                  <div key={item.id} className={`card ${styles.cartItem}`}>
                    <div
                      className={styles.itemImage}
                      style={{ background: gradient }}
                    >
                      {item.image_url ? (
                        <img
                          className={styles.itemImg}
                          src={item.image_url}
                          alt={item.name}
                          loading="lazy"
                        />
                      ) : (
                        <span className={styles.itemEmoji}>
                          {FOOD_EMOJIS[item.id] || '🍽️'}
                        </span>
                      )}
                    </div>
                    <div className={styles.itemInfo}>
                      <h3 className={styles.itemName}>{item.name}</h3>
                      <p className={styles.itemPrice}>{formatPrice(item.price)}</p>
                    </div>
                    <div className={styles.itemActions}>
                      <div className={styles.quantityControl}>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          −
                        </button>
                        <span className={styles.qtyValue}>{item.quantity}</span>
                        <button
                          className={styles.qtyBtn}
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                      </div>
                      <div className={styles.itemTotal}>
                        {formatPrice(item.price * item.quantity)}
                      </div>
                      <button
                        className={styles.removeBtn}
                        onClick={() => removeItem(item.id)}
                        title="Xóa"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                )
              })}
              <button
                className={`btn btn-ghost ${styles.clearBtn}`}
                onClick={clearCart}
              >
                🗑️ Xóa tất cả
              </button>
            </div>

            {/* Order Summary */}
            <div className={styles.cartSummary}>
              <div className={`glass-card ${styles.summaryCard}`}>
                <h3 className={styles.summaryTitle}>Tóm tắt đơn hàng</h3>
                <div className={styles.summaryRow}>
                  <span>Tạm tính</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Phí giao hàng</span>
                  <span>{formatPrice(deliveryFee)}</span>
                </div>
                <div className="divider" />
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}>
                  <span>Tổng cộng</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <button
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', marginTop: 16 }}
                  onClick={() => router.push('/checkout')}
                >
                  Tiến hành đặt hàng →
                </button>
                <Link
                  href="/menu"
                  className={`btn btn-ghost ${styles.continueBtn}`}
                >
                  ← Tiếp tục mua sắm
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
