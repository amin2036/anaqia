import { lazy, Suspense, useEffect, useRef } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import { useStore } from './context/StoreContext.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import Product from './pages/Product.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderSuccess from './pages/OrderSuccess.jsx'
import Login from './pages/Login.jsx'
import Account from './pages/Account.jsx'
import Wishlist from './pages/Wishlist.jsx'
import Track from './pages/Track.jsx'
import Contact from './pages/Contact.jsx'
import NotFound from './pages/NotFound.jsx'
import Policy from './pages/Policy.jsx'
import WhatsAppButton from './components/WhatsAppButton.jsx'

// The admin panel is loaded only when someone opens /admin, so shoppers never download it.
const AdminApp = lazy(() => import('./admin/AdminApp.jsx'))

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

export default function App() {
  const { toast, reloadCatalog } = useStore()
  const { pathname } = useLocation()
  // Coming back from the admin panel: fetch the catalogue again so edits show up right away.
  const wasAdmin = useRef(false)
  useEffect(() => {
    const isAdmin = pathname.startsWith('/admin')
    if (wasAdmin.current && !isAdmin) reloadCatalog()
    wasAdmin.current = isAdmin
  }, [pathname, reloadCatalog])
  if (pathname.startsWith('/admin')) {
    return (
      <Suspense fallback={<div style={{ padding: 40, textAlign: 'center' }}>লোড হচ্ছে...</div>}>
        <Routes><Route path="/admin/*" element={<AdminApp />} /></Routes>
      </Suspense>
    )
  }
  return (
    <>
      <ScrollTop />
      <Header />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderSuccess />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/track" element={<Track />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Policy page="help" />} />
          <Route path="/returns" element={<Policy page="returns" />} />
          <Route path="/privacy" element={<Policy page="privacy" />} />
          <Route path="/terms" element={<Policy page="terms" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
      <WhatsAppButton />
      {toast && <div className="toast">✓ {toast}</div>}
    </>
  )
}
