import { Routes, Route } from 'react-router-dom'
import './config/fontawesome'
import './styles/variables.css'
import './styles/typography.css'
import './styles/global.css'

import { CartProvider } from './context/CartContext'
import { AuthProvider } from './context/AuthContext' // ⬅️ NUEVO
import PrivateRoute from './components/PrivateRoute/PrivateRoute' // ⬅️ NUEVO

import Header from './components/Header/Header'
import Footer from './components/Footer/Footer'
import Home from './pages/Home/Home'
import Hombre from './pages/Category/Hombre'
import Mujer from './pages/Category/Mujer'
import Gorras from './pages/Category/Gorras'
import Cart from './pages/Cart/Cart'
import ProductDetail from './pages/ProductDetail/ProductDetail'
import Login from './pages/Login/Login' // ⬅️ NUEVO
import AdminDashboard from './pages/AdminDashboard/AdminDashboard' // ⬅️ NUEVO

export default function App() {
  return (
    <AuthProvider> {/* ⬅️ NUEVO: Envolver con AuthProvider */}
      <CartProvider>
        <div>
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/hombre" element={<Hombre />} />
              <Route path="/mujer" element={<Mujer />} />
              <Route path="/gorras" element={<Gorras />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/product/:id" element={<ProductDetail />} />
              
              {/* ⬅️ NUEVO: Ruta de Login */}
              <Route path="/login" element={<Login />} />
              
              {/* ⬅️ NUEVO: Ruta protegida del Admin */}
              <Route 
                path="/admin" 
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                } 
              />
            </Routes>
          </main>
          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  )
}