'use client'

import { useState, useMemo } from 'react'
import { MOCK_MENU, CATEGORIES, FOOD_GRADIENTS, FOOD_EMOJIS, formatPrice } from '@/lib/mock-data'
import { useCartStore } from '@/store/cart-store'
import { showToast } from '@/components/Toast'
import { MenuItem } from '@/types'
import styles from './menu.module.css'

export default function MenuPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('all')
  const addItem = useCartStore((s) => s.addItem)

  const filteredItems = useMemo(() => {
    let items = MOCK_MENU
    
    if (activeCategory !== 'all') {
      items = items.filter((item) => item.category === activeCategory)
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
      )
    }
    
    return items
  }, [searchQuery, activeCategory])

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price,
      image_url: item.image_url,
    })
    showToast(`Đã thêm ${item.name} vào giỏ hàng`)
  }

  return (
    <div className="page">
      <div className="container">
        {/* Hero Section */}
        <div className={styles.hero}>
          <h1 className="page-title">Khám phá món ngon 🍽️</h1>
          <p className="page-subtitle">Đa dạng ẩm thực Việt Nam, giao hàng tận nơi</p>
          
          {/* Search Bar */}
          <div className={styles.searchWrapper}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              type="text"
              className={`input ${styles.searchInput}`}
              placeholder="Tìm kiếm món ăn..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              id="menu-search"
            />
            {searchQuery && (
              <button
                className={styles.searchClear}
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Category Filter */}
        <div className={styles.categories}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`${styles.categoryChip} ${activeCategory === cat.id ? styles.categoryActive : ''}`}
              onClick={() => setActiveCategory(cat.id)}
            >
              <span>{cat.emoji}</span>
              <span>{cat.name}</span>
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        {filteredItems.length === 0 ? (
          <div className={styles.emptyState}>
            <span className={styles.emptyEmoji}>😕</span>
            <h3>Không tìm thấy món ăn</h3>
            <p>Thử tìm kiếm với từ khóa khác</p>
          </div>
        ) : (
          <div className={`${styles.menuGrid} stagger-children`}>
            {filteredItems.map((item) => (
              <div key={item.id} className={`card ${styles.menuCard}`}>
                <div
                  className={styles.menuCardImage}
                  style={{ background: FOOD_GRADIENTS[item.category] || FOOD_GRADIENTS.com }}
                >
                  <span className={styles.menuCardEmoji}>
                    {FOOD_EMOJIS[item.id] || '🍽️'}
                  </span>
                  <div className={styles.menuCardCategory}>
                    {CATEGORIES.find((c) => c.id === item.category)?.name}
                  </div>
                </div>
                <div className={styles.menuCardBody}>
                  <h3 className={styles.menuCardName}>{item.name}</h3>
                  <p className={styles.menuCardDesc}>{item.description}</p>
                  <div className={styles.menuCardFooter}>
                    <span className={styles.menuCardPrice}>
                      {formatPrice(item.price)}
                    </span>
                    <button
                      className={`btn btn-primary btn-sm ${styles.addBtn}`}
                      onClick={() => handleAddToCart(item)}
                    >
                      + Thêm
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
