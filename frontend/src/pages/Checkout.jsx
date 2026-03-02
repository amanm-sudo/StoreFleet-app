import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { placeOrder } from '../redux/slices/orderSlice'
import { clearCart } from '../redux/slices/cartSlice'
import { toast } from 'react-toastify'
import { FiMapPin, FiTruck } from 'react-icons/fi'
import './Checkout.css'

export default function Checkout() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { cartItems } = useSelector(s => s.cart)
    const { loading } = useSelector(s => s.order)

    const [shipping, setShipping] = useState({ address: '', state: '', country: 'IN', pincode: '', phoneNumber: '' })
    const [payment] = useState({ id: 'mock_payment_' + Date.now(), status: true })

    const subtotal = cartItems.reduce((a, i) => a + i.price * i.quantity, 0)
    const tax = subtotal * 0.18
    const shippingPrice = subtotal > 499 ? 0 : 49
    const total = subtotal + tax + shippingPrice

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (cartItems.length === 0) { toast.error('Cart is empty'); return }
        const orderData = {
            shippingInfo: {
                ...shipping,
                pincode: Number(shipping.pincode),
                phoneNumber: Number(shipping.phoneNumber),
            },
            orderedItems: cartItems.map(item => ({
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image || '',
                product: item.productId,
            })),
            paymentInfo: payment,
            itemsPrice: subtotal,
            taxPrice: Math.round(tax),
            shippingPrice: shippingPrice,
            totalPrice: Math.round(total),
            paidAt: new Date().toISOString(),
        }
        const result = await dispatch(placeOrder(orderData))
        if (placeOrder.fulfilled.match(result)) {
            dispatch(clearCart())
            toast.success('Order placed successfully!')
            navigate('/orders')
        } else {
            toast.error(result.payload || 'Failed to place order')
        }
    }

    return (
        <div className="page-wrapper">
            <div className="container">
                <h1 className="section-title">Checkout</h1>
                <p className="section-subtitle">Complete your shipping details</p>
                <div className="checkout-layout">
                    <form id="checkout-form" onSubmit={handleSubmit} className="checkout-form glass-card">
                        <h3 className="form-section-title"><FiMapPin /> Shipping Information</h3>

                        <div className="form-grid">
                            <div className="form-group" style={{ gridColumn: '1/-1' }}>
                                <label>Street Address</label>
                                <input id="checkout-address" className="form-input" placeholder="123 Main St, Apartment 4B" required
                                    value={shipping.address} onChange={e => setShipping({ ...shipping, address: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>State</label>
                                <input id="checkout-state" className="form-input" placeholder="Maharashtra" required
                                    value={shipping.state} onChange={e => setShipping({ ...shipping, state: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Country</label>
                                <select id="checkout-country" className="form-input"
                                    value={shipping.country} onChange={e => setShipping({ ...shipping, country: e.target.value })}>
                                    <option value="IN">India</option>
                                    <option value="US">United States</option>
                                    <option value="GB">United Kingdom</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Pincode</label>
                                <input id="checkout-pincode" className="form-input" placeholder="400001" required type="number"
                                    value={shipping.pincode} onChange={e => setShipping({ ...shipping, pincode: e.target.value })} />
                            </div>
                            <div className="form-group">
                                <label>Phone Number</label>
                                <input id="checkout-phone" className="form-input" placeholder="9876543210" required type="number"
                                    value={shipping.phoneNumber} onChange={e => setShipping({ ...shipping, phoneNumber: e.target.value })} />
                            </div>
                        </div>

                        <div className="payment-note">
                            <FiTruck /> Payment: Mock payment (pre-approved for demo)
                        </div>

                        <button type="submit" id="place-order-btn" className="btn btn-primary" style={{ width: '100%', padding: '14px', fontSize: '1rem', marginTop: '16px' }} disabled={loading}>
                            {loading ? 'Placing Order...' : `Place Order — ₹${Math.round(total).toLocaleString('en-IN')}`}
                        </button>
                    </form>

                    <div className="checkout-summary glass-card">
                        <h3 className="form-section-title">Your Items</h3>
                        {cartItems.map(item => (
                            <div className="checkout-item" key={item.productId}>
                                <img src={item.image || `https://via.placeholder.com/56x44/1a2744/3b82f6?text=P`} alt={item.name} className="checkout-img" />
                                <div className="checkout-item-info">
                                    <span className="checkout-item-name">{item.name}</span>
                                    <span className="checkout-item-qty">Qty: {item.quantity}</span>
                                </div>
                                <span className="checkout-item-price">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</span>
                            </div>
                        ))}
                        <div className="checkout-totals">
                            <div className="summary-row"><span>Subtotal</span><span>₹{subtotal.toLocaleString('en-IN')}</span></div>
                            <div className="summary-row"><span>Tax (18%)</span><span>₹{Math.round(tax).toLocaleString('en-IN')}</span></div>
                            <div className="summary-row"><span>Shipping</span><span>{shippingPrice === 0 ? <b style={{ color: 'var(--success)' }}>Free</b> : `₹${shippingPrice}`}</span></div>
                            <div className="summary-divider"></div>
                            <div className="summary-total"><span>Total</span><b>₹{Math.round(total).toLocaleString('en-IN')}</b></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
