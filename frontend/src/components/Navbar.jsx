import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/slices/userSlice'
import { FiShoppingCart, FiUser, FiLogOut, FiMenu, FiX, FiPackage, FiSettings } from 'react-icons/fi'
import './Navbar.css'

export default function Navbar() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { isAuthenticated, user } = useSelector(s => s.user)
    const { cartItems } = useSelector(s => s.cart)
    const [menuOpen, setMenuOpen] = useState(false)
    const [dropOpen, setDropOpen] = useState(false)

    const handleLogout = async () => {
        await dispatch(logoutUser())
        navigate('/')
        setDropOpen(false)
    }

    // Close dropdown on outside click
    useEffect(() => {
        const close = () => setDropOpen(false)
        if (dropOpen) document.addEventListener('click', close)
        return () => document.removeEventListener('click', close)
    }, [dropOpen])

    return (
        <nav className="navbar">
            <div className="container navbar-inner">
                <Link to="/" className="navbar-logo">
                    <span className="logo-icon">⚡</span>
                    <span className="logo-text">Store<span className="gradient-text">Fleet</span></span>
                </Link>

                <div className={`navbar-links ${menuOpen ? 'open' : ''}`}>
                    <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
                    <Link to="/products" onClick={() => setMenuOpen(false)}>Products</Link>
                    {user?.role === 'admin' && (
                        <Link to="/admin/dashboard" onClick={() => setMenuOpen(false)}>Admin</Link>
                    )}
                </div>

                <div className="navbar-actions">
                    <Link to="/cart" className="cart-btn" id="nav-cart-link">
                        <FiShoppingCart size={20} />
                        {cartItems.length > 0 && (
                            <span className="cart-badge">{cartItems.reduce((a, i) => a + i.quantity, 0)}</span>
                        )}
                    </Link>

                    {isAuthenticated ? (
                        <div className="user-menu" onClick={e => { e.stopPropagation(); setDropOpen(!dropOpen) }}>
                            <div className="user-avatar" id="nav-user-avatar">
                                {user?.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                            {dropOpen && (
                                <div className="user-dropdown">
                                    <div className="dropdown-header">
                                        <span className="dropdown-name">{user?.name}</span>
                                        <span className="dropdown-email">{user?.email}</span>
                                    </div>
                                    <Link to="/profile" id="nav-profile-link" onClick={() => setDropOpen(false)}><FiUser size={14} /> Profile</Link>
                                    <Link to="/orders" id="nav-orders-link" onClick={() => setDropOpen(false)}><FiPackage size={14} /> My Orders</Link>
                                    {user?.role === 'admin' && (
                                        <Link to="/admin/dashboard" onClick={() => setDropOpen(false)}><FiSettings size={14} /> Admin Panel</Link>
                                    )}
                                    <button id="nav-logout-btn" onClick={handleLogout} className="dropdown-logout"><FiLogOut size={14} /> Logout</button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <Link to="/auth" className="btn btn-primary" id="nav-login-btn" style={{ padding: '8px 18px' }}>Login</Link>
                    )}

                    <button className="hamburger" id="nav-hamburger" onClick={() => setMenuOpen(!menuOpen)}>
                        {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
                    </button>
                </div>
            </div>
        </nav>
    )
}
