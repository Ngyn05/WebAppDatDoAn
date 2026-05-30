'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useCartStore } from '@/store/cart-store'
import { formatPrice } from '@/lib/mock-data'
import styles from './payment.module.css'

function PaymentContent() {
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes
  const [processing, setProcessing] = useState(false)
  const [orderData, setOrderData] = useState<any>(null)
  const searchParams = useSearchParams()
  const method = searchParams.get('method') || 'zalopay'
  const clearCart = useCartStore((s) => s.clearCart)
  const router = useRouter()

  useEffect(() => {
    const stored = sessionStorage.getItem('current_order')
    if (stored) {
      setOrderData(JSON.parse(stored))
    } else {
      router.push('/menu')
    }
  }, [router])

  useEffect(() => {
    if (timeLeft <= 0) return
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleSimulatePayment = async () => {
    setProcessing(true)
    try {
      // Call Webhook API to update payment_status in database
      const response = await fetch('/api/webhook/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order_id: orderData.id,
          payment_status: 'paid',
          signature: 'mock_valid_signature'
        })
      })

      if (!response.ok) {
        throw new Error('Không thể cập nhật trạng thái thanh toán đơn hàng')
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))
      clearCart()
      sessionStorage.removeItem('current_order')
      router.push('/payment/success?method=' + method)
    } catch (err: any) {
      alert(err.message || 'Lỗi khi thanh toán')
    } finally {
      setProcessing(false)
    }
  }

  if (!orderData) {
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

  const methodName = method === 'momo' ? 'MoMo' : 'ZaloPay'
  const methodColor = method === 'momo' ? '#A50064' : '#008FE5'

  return (
    <div className="page">
      <div className="container">
        <div className={styles.paymentWrapper}>
          <div className={`glass-card ${styles.paymentCard}`}>
            <div className={styles.paymentHeader}>
              <div className={styles.methodBadge} style={{ background: methodColor }}>
                {method === 'momo' ? '💳' : '📱'} {methodName}
              </div>
              <h1 className={styles.paymentTitle}>Thanh toán đơn hàng</h1>
              <p className={styles.paymentOrderId}>Mã đơn: {orderData.id}</p>
            </div>

            {/* QR Code Simulation */}
            <div className={styles.qrSection}>
              <div className={styles.qrCode}>
                <div className={styles.qrGrid}>
                  {Array.from({ length: 64 }).map((_, i) => (
                    <div
                      key={i}
                      className={styles.qrDot}
                      style={{
                        opacity: Math.random() > 0.3 ? 1 : 0.1,
                        background: methodColor,
                      }}
                    />
                  ))}
                </div>
                <div className={styles.qrOverlay}>
                  {method === 'momo' ? '💳' : '📱'}
                </div>
              </div>
              <p className={styles.qrText}>Quét mã QR bằng ứng dụng {methodName}</p>
            </div>

            {/* Amount */}
            <div className={styles.amountSection}>
              <span className={styles.amountLabel}>Số tiền thanh toán</span>
              <span className={styles.amountValue} style={{ color: methodColor }}>
                {formatPrice(orderData.total_amount)}
              </span>
            </div>

            {/* Timer */}
            <div className={styles.timerSection}>
              <div className={styles.timerBar}>
                <div
                  className={styles.timerProgress}
                  style={{
                    width: `${(timeLeft / 300) * 100}%`,
                    background: timeLeft < 60 ? 'var(--error)' : methodColor,
                  }}
                />
              </div>
              <span className={styles.timerText}>
                {timeLeft > 0
                  ? `Thời gian còn lại: ${formatTime(timeLeft)}`
                  : 'Hết thời gian thanh toán'}
              </span>
            </div>

            {/* Simulate Payment Button */}
            <button
              className="btn btn-primary btn-lg"
              style={{ width: '100%', background: methodColor }}
              onClick={handleSimulatePayment}
              disabled={processing || timeLeft <= 0}
            >
              {processing ? (
                <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Đang xử lý thanh toán...</>
              ) : (
                `✅ Giả lập thanh toán thành công`
              )}
            </button>

            <button
              className="btn btn-ghost"
              style={{ width: '100%', marginTop: 8 }}
              onClick={() => router.push('/checkout')}
              disabled={processing}
            >
              ← Quay lại
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentPage() {
  return (
    <Suspense fallback={
      <div className="page">
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
            <div className="spinner spinner-lg" />
          </div>
        </div>
      </div>
    }>
      <PaymentContent />
    </Suspense>
  )
}

