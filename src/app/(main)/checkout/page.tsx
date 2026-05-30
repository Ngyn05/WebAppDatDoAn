'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/mock-data'
import { DeliveryInfo, PaymentMethod } from '@/types'
import styles from './checkout.module.css'

const PHONE_REGEX = /^(0[3|5|7|8|9])+([0-9]{8})$/

const PAYMENT_METHODS = [
  { id: 'cod' as PaymentMethod, name: 'Thanh toán khi nhận hàng', icon: '💵', desc: 'Trả tiền mặt khi nhận đơn' },
  { id: 'zalopay' as PaymentMethod, name: 'ZaloPay', icon: '📱', desc: 'Thanh toán qua ví ZaloPay' },
  { id: 'momo' as PaymentMethod, name: 'MoMo', icon: '💳', desc: 'Thanh toán qua ví MoMo' },
]

export default function CheckoutPage() {
  const [mounted, setMounted] = useState(false)
  const [deliveryInfo, setDeliveryInfo] = useState<DeliveryInfo>({
    customer_name: '',
    phone: '',
    address: '',
    note: '',
  })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)

  const items = useCartStore((s) => s.items)
  const getTotalPrice = useCartStore((s) => s.getTotalPrice)
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()

  useEffect(() => { setMounted(true) }, [])

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

  if (items.length === 0) {
    return (
      <div className="page">
        <div className="container">
          <div className={styles.emptyState}>
            <span style={{ fontSize: '4rem' }}>🛒</span>
            <h3>Giỏ hàng trống</h3>
            <p>Vui lòng thêm món ăn trước khi đặt hàng</p>
            <Link href="/menu" className="btn btn-primary" style={{ marginTop: 16 }}>🍽️ Xem menu</Link>
          </div>
        </div>
      </div>
    )
  }

  const deliveryFee = 15000
  const subtotal = getTotalPrice()
  const total = subtotal + deliveryFee

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!deliveryInfo.customer_name.trim()) {
      newErrors.customer_name = 'Vui lòng nhập họ tên'
    }

    if (!deliveryInfo.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại'
    } else if (!PHONE_REGEX.test(deliveryInfo.phone)) {
      newErrors.phone = 'Số điện thoại không hợp lệ (VD: 0901234567)'
    }

    if (!deliveryInfo.address.trim()) {
      newErrors.address = 'Vui lòng nhập địa chỉ giao hàng'
    } else if (deliveryInfo.address.trim().length < 10) {
      newErrors.address = 'Địa chỉ quá ngắn, vui lòng nhập chi tiết hơn'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return

    setLoading(true)

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...deliveryInfo,
          payment_method: paymentMethod,
          total_amount: total,
          items: items.map(item => ({
            id: item.id === '1' ? '11111111-1111-1111-1111-111111111111' : 
                item.id === '2' ? '22222222-2222-2222-2222-222222222222' :
                item.id === '3' ? '33333333-3333-3333-3333-333333333333' :
                item.id === '4' ? '44444444-4444-4444-4444-444444444444' :
                item.id === '5' ? '55555555-5555-5555-5555-555555555555' :
                item.id === '6' ? '66666666-6666-6666-6666-666666666666' :
                item.id === '7' ? '77777777-7777-7777-7777-777777777777' :
                item.id === '8' ? '88888888-8888-8888-8888-888888888888' :
                item.id === '9' ? '99999999-9999-9999-9999-999999999999' :
                item.id === '10' ? 'a0a0a0a0-a0a0-a0a0-a0a0-a0a0a0a0a0a0' : item.id,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image_url: item.image_url
          }))
        })
      })

      const resData = await response.json()
      if (!response.ok) {
        throw new Error(resData.error || 'Đặt hàng thất bại')
      }

      const createdOrder = resData.order
      sessionStorage.setItem('current_order', JSON.stringify(createdOrder))

      if (paymentMethod === 'cod') {
        clearCart()
        router.push('/payment/success?method=cod')
      } else {
        router.push(`/payment?method=${paymentMethod}`)
      }
    } catch (err: any) {
      alert(err.message || 'Đã xảy ra lỗi khi tạo đơn hàng. Bạn đã đăng nhập chưa?')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof DeliveryInfo, value: string) => {
    setDeliveryInfo((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="page">
      <div className="container">
        <h1 className="page-title">Đặt hàng 🚚</h1>
        <p className="page-subtitle">Nhập thông tin giao hàng</p>

        <form onSubmit={handleSubmit} className={styles.checkoutLayout}>
          {/* Delivery Form */}
          <div className={styles.formSection}>
            <div className={`glass-card ${styles.formCard}`}>
              <h2 className={styles.sectionTitle}>📍 Thông tin giao hàng</h2>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-name">Họ và tên *</label>
                <input
                  id="checkout-name"
                  type="text"
                  className={`input ${errors.customer_name ? 'input-error' : ''}`}
                  placeholder="Nguyễn Văn A"
                  value={deliveryInfo.customer_name}
                  onChange={(e) => handleChange('customer_name', e.target.value)}
                />
                {errors.customer_name && <span className="error-text">{errors.customer_name}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-phone">Số điện thoại *</label>
                <input
                  id="checkout-phone"
                  type="tel"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  placeholder="0901234567"
                  value={deliveryInfo.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-address">Địa chỉ giao hàng *</label>
                <textarea
                  id="checkout-address"
                  className={`input ${errors.address ? 'input-error' : ''}`}
                  placeholder="Số nhà, tên đường, phường/xã, quận/huyện, TP..."
                  value={deliveryInfo.address}
                  onChange={(e) => handleChange('address', e.target.value)}
                  rows={3}
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>

              <div className="input-group">
                <label className="input-label" htmlFor="checkout-note">Ghi chú (tuỳ chọn)</label>
                <textarea
                  id="checkout-note"
                  className="input"
                  placeholder="VD: Giao giờ hành chính, gọi trước khi giao..."
                  value={deliveryInfo.note || ''}
                  onChange={(e) => handleChange('note', e.target.value)}
                  rows={2}
                />
              </div>
            </div>

            {/* Payment Method */}
            <div className={`glass-card ${styles.formCard}`}>
              <h2 className={styles.sectionTitle}>💳 Phương thức thanh toán</h2>
              <div className={styles.paymentMethods}>
                {PAYMENT_METHODS.map((method) => (
                  <label
                    key={method.id}
                    className={`${styles.paymentOption} ${paymentMethod === method.id ? styles.paymentActive : ''}`}
                  >
                    <input
                      type="radio"
                      name="payment"
                      value={method.id}
                      checked={paymentMethod === method.id}
                      onChange={() => setPaymentMethod(method.id)}
                      className={styles.paymentRadio}
                    />
                    <span className={styles.paymentIcon}>{method.icon}</span>
                    <div className={styles.paymentInfo}>
                      <span className={styles.paymentName}>{method.name}</span>
                      <span className={styles.paymentDesc}>{method.desc}</span>
                    </div>
                    <div className={styles.paymentCheck}>
                      {paymentMethod === method.id && '✓'}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className={styles.summarySide}>
            <div className={`glass-card ${styles.summaryCard}`}>
              <h3 className={styles.summaryTitle}>🛒 Đơn hàng ({items.length} món)</h3>
              <div className={styles.summaryItems}>
                {items.map((item) => (
                  <div key={item.id} className={styles.summaryItem}>
                    <span className={styles.summaryItemName}>
                      {item.name} x{item.quantity}
                    </span>
                    <span className={styles.summaryItemPrice}>
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="divider" />
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
                type="submit"
                className="btn btn-primary btn-lg"
                style={{ width: '100%', marginTop: 20 }}
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Đang xử lý...</>
                ) : (
                  paymentMethod === 'cod' ? '✅ Xác nhận đơn hàng' : `💳 Thanh toán ${formatPrice(total)}`
                )}
              </button>
              <Link href="/cart" className="btn btn-ghost" style={{ width: '100%', marginTop: 8, textAlign: 'center', display: 'block' }}>
                ← Quay lại giỏ hàng
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
