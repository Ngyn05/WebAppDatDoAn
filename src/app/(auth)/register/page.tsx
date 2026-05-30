'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import styles from '../auth.module.css'

export default function RegisterPage() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (password !== confirmPassword) {
      setError('Mật khẩu xác nhận không khớp')
      return
    }

    if (password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    setLoading(true)

    try {
      const supabase = createClient()
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Email này đã được đăng ký')
        } else {
          setError(authError.message)
        }
        return
      }

      if (data?.session) {
        setSuccess('Đăng ký thành công! Đang chuyển hướng...')
        setTimeout(() => {
          router.push('/menu')
          router.refresh()
        }, 1500)
      } else {
        setSuccess('Đăng ký thành công! Vui lòng kiểm tra email của bạn để xác nhận kích hoạt tài khoản trước khi đăng nhập.')
      }
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
        <p>Tạo tài khoản mới</p>
      </div>

      {error && (
        <div className={styles.authError}>
          <span>⚠️</span> {error}
        </div>
      )}

      {success && (
        <div className={styles.authSuccess}>
          <span>✅</span> {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className={styles.authForm}>
        <div className="input-group">
          <label className="input-label" htmlFor="register-name">Họ và tên</label>
          <input
            id="register-name"
            type="text"
            className="input"
            placeholder="Nguyễn Văn A"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="register-email">Email</label>
          <input
            id="register-email"
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
          <label className="input-label" htmlFor="register-password">Mật khẩu</label>
          <div className={styles.passwordToggle}>
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              className="input"
              placeholder="Ít nhất 6 ký tự"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>
        </div>

        <div className="input-group">
          <label className="input-label" htmlFor="register-confirm">Xác nhận mật khẩu</label>
          <input
            id="register-confirm"
            type="password"
            className="input"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
            autoComplete="new-password"
          />
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
              Đang đăng ký...
            </>
          ) : (
            'Đăng ký'
          )}
        </button>
      </form>

      <div className={styles.authFooter}>
        Đã có tài khoản?{' '}
        <Link href="/login">Đăng nhập</Link>
      </div>
    </div>
  )
}
