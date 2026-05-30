import Navbar from '@/components/Navbar'
import ToastProvider from '@/components/Toast'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <ToastProvider />
    </>
  )
}
