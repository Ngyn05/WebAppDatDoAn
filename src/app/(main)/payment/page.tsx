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

      await new Promise((resolve) => setTimeout(resolve, 1200))
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

  const isMomo = method === 'momo'
  const methodName = isMomo ? 'MoMo' : 'ZaloPay'
  const methodColor = isMomo ? '#A50064' : '#008FE5'
  const headerClass = isMomo ? styles.momoHeader : styles.zalopayHeader

  return (
    <div className="page">
      <div className="container">
        <div className={styles.paymentWrapper}>
          <div className={styles.paymentCard}>
            
            {/* Gateway Header */}
            <div className={`${styles.gatewayHeader} ${headerClass}`}>
              <div className={styles.logoArea}>
                <div className={styles.logoCircle} style={{ color: methodColor }}>
                  {isMomo ? (
                    <svg viewBox="0 0 100 100" width="30" height="30">
                      <rect width="100" height="100" rx="20" fill="#A50064" />
                      <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6" />
                      <circle cx="38" cy="50" r="7" fill="white" />
                      <circle cx="62" cy="50" r="7" fill="white" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 100 100" width="30" height="30">
                      <rect width="100" height="100" rx="20" fill="#008FE5" />
                      <text x="50" y="65" fill="white" fontSize="42" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">ZP</text>
                    </svg>
                  )}
                </div>
                <h1 className={styles.gatewayTitle}>CỔNG THANH TOÁN VÍ {methodName.toUpperCase()}</h1>
              </div>
              <p style={{ opacity: 0.8, fontSize: '0.85rem' }}>An toàn - Bảo mật - Nhanh chóng</p>
            </div>

            {/* Gateway Body */}
            <div className={styles.gatewayBody}>
              
              {/* Left Column: Merchant & Instruction */}
              <div className={styles.infoSection}>
                
                {/* Merchant detail box */}
                <div className={styles.merchantBox}>
                  <div className={styles.merchantRow}>
                    <span className={styles.label}>Đơn vị nhận tiền:</span>
                    <span className={styles.value} style={{ color: 'var(--primary-light)' }}>🍔 FoodApp Store</span>
                  </div>
                  <div className={styles.merchantRow}>
                    <span className={styles.label}>Mã đơn hàng:</span>
                    <span className={styles.value} style={{ fontFamily: 'monospace' }}>{orderData.id}</span>
                  </div>
                  <div className={styles.merchantRow} style={{ borderBottom: 'none', paddingBottom: 0 }}>
                    <span className={styles.label}>Số tiền cần thanh toán:</span>
                    <span className={`${styles.value} ${styles.amountBig}`} style={{ color: methodColor }}>
                      {formatPrice(orderData.total_amount)}
                    </span>
                  </div>
                </div>

                {/* Guide steps */}
                <div className={styles.guideBox}>
                  <h3 className={styles.guideTitle}>
                    <span>📝</span> Hướng dẫn thanh toán bằng ứng dụng {methodName}
                  </h3>
                  <div className={styles.stepList}>
                    <div className={styles.stepItem}>
                      <span className={styles.stepNumber}>1</span>
                      <p>Mở ứng dụng <strong>{methodName}</strong> trên điện thoại di động của bạn.</p>
                    </div>
                    <div className={styles.stepItem}>
                      <span className={styles.stepNumber}>2</span>
                      <p>Chọn chức năng <strong>"Quét Mã QR"</strong> và hướng camera quét hình mã QR ở bên cạnh.</p>
                    </div>
                    <div className={styles.stepItem}>
                      <span className={styles.stepNumber}>3</span>
                      <p>Kiểm tra số tiền và nội dung thanh toán trùng khớp, sau đó bấm <strong>"Xác nhận thanh toán"</strong> để hoàn tất.</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: QR box & Countdown timer */}
              <div className={styles.qrSection}>
                
                {/* QR box layout */}
                <div className={styles.qrContainer}>
                  
                  {/* Scan target corners */}
                  <div className={`${styles.qrFrameCorner} ${styles.topLeft}`} style={{ borderColor: `${methodColor} transparent transparent ${methodColor}` }} />
                  <div className={`${styles.qrFrameCorner} ${styles.topRight}`} style={{ borderColor: `${methodColor} ${methodColor} transparent transparent` }} />
                  <div className={`${styles.qrFrameCorner} ${styles.bottomLeft}`} style={{ borderColor: `transparent transparent transparent ${methodColor}` }} />
                  <div className={`${styles.qrFrameCorner} ${styles.bottomRight}`} style={{ borderColor: `transparent ${methodColor} ${methodColor} transparent` }} />
                  
                  {/* QR rendering SVG */}
                  <div className={styles.qrCode}>
                    <svg width="100%" height="100%" viewBox="0 0 100 100" fill={methodColor}>
                      {/* Corner 1 (Top Left) */}
                      <rect x="0" y="0" width="22" height="22" rx="2" />
                      <rect x="3" y="3" width="16" height="16" fill="white" rx="1.5" />
                      <rect x="6" y="6" width="10" height="10" rx="1" />
                      
                      {/* Corner 2 (Top Right) */}
                      <rect x="78" y="0" width="22" height="22" rx="2" />
                      <rect x="81" y="3" width="16" height="16" fill="white" rx="1.5" />
                      <rect x="84" y="6" width="10" height="10" rx="1" />
                      
                      {/* Corner 3 (Bottom Left) */}
                      <rect x="0" y="78" width="22" height="22" rx="2" />
                      <rect x="3" y="81" width="16" height="16" fill="white" rx="1.5" />
                      <rect x="6" y="84" width="10" height="10" rx="1" />
                      
                      {/* Corner 4 (Bottom Right Alignment) */}
                      <rect x="78" y="78" width="8" height="8" rx="1" />
                      <rect x="80" y="80" width="4" height="4" fill="white" />
                      
                      {/* Outer random QR structures */}
                      <rect x="28" y="2" width="4" height="12" />
                      <rect x="36" y="0" width="12" height="4" />
                      <rect x="52" y="3" width="6" height="4" />
                      <rect x="62" y="0" width="4" height="14" />
                      <rect x="70" y="4" width="5" height="4" />
                      
                      <rect x="2" y="28" width="14" height="4" />
                      <rect x="0" y="36" width="4" height="12" />
                      <rect x="3" y="52" width="4" height="6" />
                      <rect x="0" y="62" width="14" height="4" />
                      <rect x="4" y="70" width="4" height="5" />

                      {/* Random data squares */}
                      <rect x="28" y="18" width="16" height="4" />
                      <rect x="28" y="26" width="4" height="8" />
                      <rect x="36" y="26" width="8" height="4" />
                      <rect x="48" y="18" width="4" height="10" />
                      <rect x="56" y="22" width="18" height="4" />
                      <rect x="68" y="10" width="4" height="16" />
                      <rect x="18" y="28" width="10" height="4" />
                      <rect x="26" y="28" width="4" height="16" />
                      <rect x="18" y="48" width="4" height="10" />
                      <rect x="22" y="56" width="18" height="4" />
                      <rect x="10" y="68" width="4" height="16" />
                      <rect x="78" y="28" width="12" height="4" />
                      <rect x="92" y="30" width="4" height="10" />
                      <rect x="80" y="40" width="16" height="4" />
                      <rect x="86" y="48" width="4" height="12" />
                      <rect x="28" y="78" width="16" height="4" />
                      <rect x="48" y="74" width="4" height="10" />
                      <rect x="30" y="86" width="4" height="14" />
                      <rect x="38" y="94" width="16" height="4" />
                      <rect x="56" y="78" width="12" height="4" />
                      <rect x="72" y="74" width="4" height="16" />
                      <rect x="58" y="94" width="18" height="4" />
                      <rect x="72" y="86" width="4" height="10" />

                      <rect x="28" y="48" width="4" height="24" />
                      <rect x="28" y="64" width="20" height="4" />
                      <rect x="44" y="48" width="4" height="12" />
                      <rect x="48" y="48" width="16" height="4" />
                      <rect x="60" y="52" width="4" height="16" />
                      <rect x="48" y="64" width="16" height="4" />
                      <rect x="78" y="64" width="16" height="4" />
                      <rect x="86" y="70" width="4" height="8" />

                      {/* Center gap for logo */}
                      <rect x="34" y="34" width="32" height="32" fill="white" rx="4" />
                    </svg>

                    {/* Central Brand Mini Logo */}
                    <div className={styles.qrLogo}>
                      {isMomo ? (
                        <svg viewBox="0 0 100 100" width="32" height="32">
                          <rect width="100" height="100" rx="20" fill="#A50064" />
                          <circle cx="50" cy="50" r="28" fill="none" stroke="white" strokeWidth="6" />
                          <circle cx="38" cy="50" r="7" fill="white" />
                          <circle cx="62" cy="50" r="7" fill="white" />
                        </svg>
                      ) : (
                        <svg viewBox="0 0 100 100" width="32" height="32">
                          <rect width="100" height="100" rx="20" fill="#008FE5" />
                          <text x="50" y="65" fill="white" fontSize="42" fontWeight="900" textAnchor="middle" fontFamily="system-ui, sans-serif">ZP</text>
                        </svg>
                      )}
                    </div>
                  </div>
                  
                </div>
                <p className={styles.qrText}>Hỗ trợ quét mã bằng {methodName}</p>

                {/* Countdown Timer */}
                <div className={styles.timerBox}>
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
                    ⏳ {timeLeft > 0
                      ? `Thời gian quét mã còn lại: ${formatTime(timeLeft)}`
                      : 'Mã QR đã hết hạn thanh toán'}
                  </span>
                </div>

              </div>

            </div>

            {/* Gateway Actions Footer */}
            <div className={styles.gatewayFooter}>
              <button
                className="btn btn-primary btn-lg"
                style={{ width: '100%', background: methodColor, fontSize: '1.05rem' }}
                onClick={handleSimulatePayment}
                disabled={processing || timeLeft <= 0}
              >
                {processing ? (
                  <><span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> Đang đối chiếu giao dịch...</>
                ) : (
                  `✅ Xác nhận đã quét mã thanh toán`
                )}
              </button>

              <button
                className="btn btn-secondary"
                style={{ width: '100%', borderColor: 'rgba(255, 255, 255, 0.1)' }}
                onClick={() => router.push('/checkout')}
                disabled={processing}
              >
                Hủy giao dịch & Quay lại
              </button>
            </div>

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


