import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'FoodApp - Đặt đồ ăn online',
  description: 'Ứng dụng đặt đồ ăn trực tuyến nhanh chóng, tiện lợi. Đa dạng món Việt Nam, giao hàng tận nơi.',
  keywords: 'đặt đồ ăn, food delivery, đồ ăn online, giao hàng',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  )
}
