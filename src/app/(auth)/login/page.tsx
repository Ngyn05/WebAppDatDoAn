'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from '../auth.module.css'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (authError) {
        if (authError.message.includes('Invalid login credentials')) {
          setError('Email hoặc mật khẩu không đúng')
        } else if (authError.message.includes('Email not confirmed') || authError.message.toLowerCase().includes('confirm')) {
          setError('Tài khoản chưa được kích hoạt. Vui lòng kiểm tra hộp thư email của bạn để xác nhận tài khoản.')
        } else {
          setError(authError.message)
        }
        return
      }

      router.push('/menu')
      router.refresh()
    } catch {
      setError('Đã có lỗi xảy ra. Vui lòng thử lại.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={styles.authCard}>
      <div className={styles.authLogo}>
        <h1>🍔 Food<span>App</span></h1>
        <p>Đăng nhập để đặt đồ ăn</p>
      </div>

      {error && (
        <div className={styles.authError}>
          <span>⚠️</span> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className="input-group">
          <label className="input-label" htmlFor="login-email">Email</label>
          <input
            id="login-email"
            type="email"
            className="input"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="login-password">Mật khẩu</label>
          <div className={styles.passwordToggle}>
            <input
              id="login-password"
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="current-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          className="btn btn-primary btn-lg"
          disabled={loading}
          style={{ width: '100%', marginTop: '8px' }}
        >
          {loading ? (
            <>
              <span className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              Đang đăng nhập...
            </>
          ) : (
            'Đăng nhập'
          )}
        </button>
      </form>

      <div className={styles.authFooter}>
        Chưa có tài khoản?{' '}
        <Link href="/register">Đăng ký ngay</Link>
      </div>
    </div>
  )
}
