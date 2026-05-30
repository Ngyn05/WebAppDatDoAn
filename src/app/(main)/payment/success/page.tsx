'use client'

import { useEffect, useState, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import styles from './success.module.css'

function PaymentSuccessContent() {
  const [show, setShow] = useState(false)
  const searchParams = useSearchParams()
  const method = searchParams.get('method') || 'cod'

  useEffect(() => {
    setTimeout(() => setShow(true), 100)
  }, [])

  const methodText = method === 'cod' 
    ? 'Thanh toán khi nhận hàng' 
    : method === 'momo' 
    ? 'MoMo' 
    : 'ZaloPay'

  return (
    <div className="page">
      <div className="container">
        <div className={`${styles.successWrapper} ${show ? styles.show : ''}`}>
          <div className={`glass-card ${styles.successCard}`}>
            {/* Confetti */}
            <div className={styles.confetti}>
              {['🎉', '🎊', '✨', '🌟', '💫'].map((emoji, i) => (
                <span
                  key={i}
                  className={styles.confettiItem}
                  style={{
                    left: `${15 + i * 18}%`,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  {emoji}
                </span>
              ))}
            </div>

            <div className={styles.checkMark}>
              <span>✓</span>
            </div>

            <h1 className={styles.successTitle}>Đặt hàng thành công!</h1>
            <p className={styles.successDesc}>
              Đơn hàng của bạn đã được xác nhận.<br />
              Phương thức: <strong>{methodText}</strong>
            </p>

            <div className={styles.infoBox}>
              <div className={styles.infoRow}>
                <span>📦 Trạng thái</span>
                <span className="badge badge-success">Đã xác nhận</span>
              </div>
              <div className={styles.infoRow}>
                <span>⏰ Dự kiến giao</span>
                <span>30 - 45 phút</span>
              </div>
            </div>

            <div className={styles.actions}>
              <Link href="/orders" className="btn btn-primary btn-lg" style={{ flex: 1 }}>
                📋 Xem đơn hàng
              </Link>
              <Link href="/menu" className="btn btn-secondary btn-lg" style={{ flex: 1 }}>
                🍽️ Tiếp tục mua
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
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
      <PaymentSuccessContent />
    </Suspense>
  )
}

