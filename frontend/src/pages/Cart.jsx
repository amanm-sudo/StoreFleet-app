import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { removeFromCart, updateQuantity, clearCart } from '../redux/slices/cartSlice'
import { FiTrash2, FiShoppingBag } from 'react-icons/fi'
import './Cart.css'

export default function Cart() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector(s => s.cart)
    const { isAuthenticated } = useSelector(s => s.user)

    const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
    const tax = subtotal * 0.18
    const shipping = subtotal > 499 ? 0 : 49
    const total = subtotal + tax + shipping

    const handleCheckout = () => {
        if (!isAuthenticated) { navigate('/auth'); return }
        navigate('/checkout')
    }

    if (cartItems.length === 0) return (
        <div className="page-wrapper">
            <div className="container empty-cart">
                <FiShoppingBag size={64} />
                <h2>Your cart is empty</h2>
                <p>Add some products to get started!</p>
                <Link to="/products" className="btn btn-primary" id="cart-shop-btn">Shop Now</Link>
            </div>
        </div>
    )

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 className="section-title">Shopping Cart</h1>
                <p className="section-subtitle">{cartItems.reduce((a, i) => a + i.quantity, 0)} items in your cart</p>
                <div className="cart-layout">
                    <div className="cart-items">
                        {cartItems.map(item => (
                            <div className="cart-item glass-card" key={item.productId} id={`cart-item-${item.productId}`}>
                                <img src={item.image || `https://via.placeholder.com/100x80/1a2744/3b82f6?text=${encodeURIComponent(item.name)}`} alt={item.name} className="cart-img" />
                                <div className="cart-item-info">
                                    <Link to={`/product/${item.productId}`} className="cart-item-name">{item.name}</Link>
                                    <span className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="cart-qty-ctrl">
                                    <button id={`cart-minus-${item.productId}`} onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.max(1, item.quantity - 1) }))}>−</button>
                                    <span>{item.quantity}</span>
                                    <button id={`cart-plus-${item.productId}`} onClick={() => dispatch(updateQuantity({ productId: item.productId, quantity: Math.min(item.stock, item.quantity + 1) }))}>+</button>
                                </div>
                                <span className="cart-line-total">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</span>
                                <button className="cart-remove-btn" id={`cart-remove-${item.productId}`} onClick={() => dispatch(removeFromCart(item.productId))}><FiTrash2 /></button>
                            </div>
                        ))}
                        <button className="btn btn-danger" id="clear-cart-btn" onClick={() => dispatch(clearCart())} style={{ alignSelf: 'flex-start', marginTop: '8px' }}>
                            Clear Cart
                        </button>
                    </div>

                    <div className="order-summary glass-card">
                        <h3 className="summary-title">Order Summary</h3>
                        <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                        <div className="summary-row"><span>Tax (18%)</span><span>₹{Math.round(tax).toLocaleString('en-IN')}</span></div>
                        <div className="summary-row"><span>Shipping</span><span>{shipping === 0 ? <span style={{ color: 'var(--success)' }}>Free</span> : `₹${shipping}`}</span></div>
                        {shipping === 49 && <p className="free-shipping-hint">Add ₹{(499 - subtotal).toFixed(0)} more for free shipping!</p>}
                        <div className="summary-divider"></div>
                        <div className="summary-total"><span>Total</span><span>₹{Math.round(total).toLocaleString('en-IN')}</span></div>
                        <button className="btn btn-primary" id="checkout-btn" onClick={handleCheckout} style={{ width: '100%', padding: '14px', marginTop: '20px', fontSize: '1rem' }}>
                            Proceed to Checkout
                        </button>
                        <Link to="/products" className="btn btn-outline" style={{ width: '100%', padding: '12px', marginTop: '10px', justifyContent: 'center' }}>Continue Shopping</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
