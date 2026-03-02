import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { updateProfile, updatePassword, clearError, clearMessage } from '../redux/slices/userSlice'
import { fetchMyOrders } from '../redux/slices/orderSlice'
import { toast } from 'react-toastify'
import { FiUser, FiLock, FiPackage } from 'react-icons/fi'
import './Profile.css'

export default function Profile() {
    const dispatch = useDispatch()
    const { user, loading, error, message } = useSelector(s => s.user)
    const { myOrders } = useSelector(s => s.order)
    const [tab, setTab] = useState('profile')
    const [profileData, setProfileData] = useState({ name: user?.name || '', email: user?.email || '' })
    const [pwData, setPwData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })

    useEffect(() => { dispatch(fetchMyOrders()) }, [dispatch])
    useEffect(() => { if (error) { toast.error(error); dispatch(clearError()) } }, [error])
    useEffect(() => { if (message) { toast.success(message); dispatch(clearMessage()) } }, [message])

    const handleProfileUpdate = async (e) => {
        e.preventDefault()
        dispatch(updateProfile(profileData))
    }

    const handlePasswordUpdate = async (e) => {
        e.preventDefault()
        if (pwData.newPassword !== pwData.confirmPassword) { toast.error('Passwords do not match'); return }
        dispatch(updatePassword(pwData))
        setPwData({ currentPassword: '', newPassword: '', confirmPassword: '' })
    }

    const statusColor = (status) => {
        if (status === 'Delivered') return 'badge-green'
        if (status === 'Processing') return 'badge-yellow'
        return 'badge-blue'
    }

    return (
        <div className="page-wrapper">
            <div className="container profile-layout">
                {/* Sidebar */}
                <aside className="profile-sidebar glass-card">
                    <div className="profile-avatar-wrap">
                        <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
                        <h3>{user?.name}</h3>
                        <span className="badge badge-blue">{user?.role}</span>
                        <p className="profile-email">{user?.email}</p>
                    </div>
                    <nav className="profile-nav">
                        <button id="tab-profile-info" className={tab === 'profile' ? 'active' : ''} onClick={() => setTab('profile')}>
                            <FiUser /> Profile Info
                        </button>
                        <button id="tab-password" className={tab === 'password' ? 'active' : ''} onClick={() => setTab('password')}>
                            <FiLock /> Change Password
                        </button>
                        <button id="tab-orders" className={tab === 'orders' ? 'active' : ''} onClick={() => setTab('orders')}>
                            <FiPackage /> My Orders
                        </button>
                    </nav>
                </aside>

                {/* Content */}
                <div className="profile-content glass-card">
                    {tab === 'profile' && (
                        <>
                            <h2 className="content-title">Profile Information</h2>
                            <form id="profile-update-form" onSubmit={handleProfileUpdate}>
                                <div className="form-group">
                                    <label>Full Name</label>
                                    <input id="profile-name" className="form-input" value={profileData.name}
                                        onChange={e => setProfileData({ ...profileData, name: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <input id="profile-email-input" type="email" className="form-input" value={profileData.email}
                                        onChange={e => setProfileData({ ...profileData, email: e.target.value })} />
                                </div>
                                <button type="submit" id="update-profile-btn" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </button>
                            </form>
                        </>
                    )}

                    {tab === 'password' && (
                        <>
                            <h2 className="content-title">Change Password</h2>
                            <form id="change-password-form" onSubmit={handlePasswordUpdate}>
                                <div className="form-group">
                                    <label>Current Password</label>
                                    <input id="current-password" type="password" className="form-input" required
                                        value={pwData.currentPassword} onChange={e => setPwData({ ...pwData, currentPassword: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>New Password</label>
                                    <input id="new-password" type="password" className="form-input" required minLength={6}
                                        value={pwData.newPassword} onChange={e => setPwData({ ...pwData, newPassword: e.target.value })} />
                                </div>
                                <div className="form-group">
                                    <label>Confirm New Password</label>
                                    <input id="confirm-password" type="password" className="form-input" required minLength={6}
                                        value={pwData.confirmPassword} onChange={e => setPwData({ ...pwData, confirmPassword: e.target.value })} />
                                </div>
                                <button type="submit" id="change-password-btn" className="btn btn-primary" disabled={loading}>
                                    {loading ? 'Updating...' : 'Update Password'}
                                </button>
                            </form>
                        </>
                    )}

                    {tab === 'orders' && (
                        <>
                            <h2 className="content-title">My Orders</h2>
                            {myOrders.length === 0 ? (
                                <p style={{ color: 'var(--text-secondary)' }}>No orders yet. <a href="/products" style={{ color: 'var(--accent-blue)' }}>Start shopping!</a></p>
                            ) : (
                                <div className="orders-table-wrap">
                                    <table className="data-table" id="orders-table">
                                        <thead>
                                            <tr><th>Order ID</th><th>Date</th><th>Items</th><th>Total</th><th>Status</th></tr>
                                        </thead>
                                        <tbody>
                                            {myOrders.map(order => (
                                                <tr key={order._id}>
                                                    <td style={{ fontFamily: 'monospace', fontSize: '0.8rem' }}>{order._id.slice(-8).toUpperCase()}</td>
                                                    <td>{new Date(order.createdAt).toLocaleDateString('en-IN')}</td>
                                                    <td>{order.orderedItems?.length || 0}</td>
                                                    <td>₹{order.totalPrice?.toLocaleString('en-IN')}</td>
                                                    <td><span className={`badge ${statusColor(order.orderStatus)}`}>{order.orderStatus}</span></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    )
}
