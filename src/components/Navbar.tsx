'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { useCartStore } from '@/store/cart-store'
import styles from './Navbar.module.css'

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const getTotalItems = useCartStore((s) => s.getTotalItems)
  const clearCart = useCartStore((s) => s.clearCart)

  useEffect(() => {
    setMounted(true)
    const supabase = createClient()
    
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)

    return () => {
      subscription.unsubscribe()
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const handleLogout = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    clearCart()
    setMenuOpen(false)
    router.push('/login')
    router.refresh()
  }

  const cartCount = mounted ? getTotalItems() : 0

  return (
    <nav className={`${styles.navbar} ${scrolled ? styles.scrolled : ''}`}>
      <div className={`container ${styles.navInner}`}>
        <Link href="/menu" className={styles.logo}>
          <span className={styles.logoEmoji}>🍔</span>
          <span className={styles.logoText}>Food<span>App</span></span>
        </Link>

        <div className={styles.navLinks}>
          <Link
            href="/menu"
            className={`${styles.navLink} ${pathname === '/menu' ? styles.active : ''}`}
          >
            🍽️ Menu
          </Link>
          {user && (
            <Link
              href="/orders"
              className={`${styles.navLink} ${pathname === '/orders' ? styles.active : ''}`}
            >
              📋 Đơn hàng
            </Link>
          )}
        </div>

        <div className={styles.navActions}>
          <Link href="/cart" className={styles.cartBtn}>
            <span className={styles.cartIcon}>🛒</span>
            {cartCount > 0 && (
              <span className={styles.cartBadge}>{cartCount}</span>
            )}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <button
                className={styles.avatarBtn}
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <div className={styles.avatar}>
                  {user.user_metadata?.full_name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
                </div>
              </button>
              {menuOpen && (
                <>
                  <div className={styles.menuOverlay} onClick={() => setMenuOpen(false)} />
                  <div className={styles.dropdown}>
                    <div className={styles.dropdownHeader}>
                      <div className={styles.dropdownName}>
                        {user.user_metadata?.full_name || 'Người dùng'}
                      </div>
                      <div className={styles.dropdownEmail}>{user.email}</div>
                    </div>
                    <div className={styles.dropdownDivider} />
                    <Link
                      href="/orders"
                      className={styles.dropdownItem}
                      onClick={() => setMenuOpen(false)}
                    >
                      📋 Đơn hàng của tôi
                    </Link>
                    <button
                      className={`${styles.dropdownItem} ${styles.logoutBtn}`}
                      onClick={handleLogout}
                    >
                      🚪 Đăng xuất
                    </button>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link href="/login" className="btn btn-primary btn-sm">
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}
