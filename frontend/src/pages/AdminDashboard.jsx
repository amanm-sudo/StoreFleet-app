import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsersAdmin, updateUserRoleAdmin, deleteUserAdmin, clearError, clearMessage } from '../redux/slices/userSlice'
import { fetchAllProducts, addProductAdmin, deleteProductAdmin } from '../redux/slices/productSlice'
import { toast } from 'react-toastify'
import { FiUsers, FiPackage, FiTrash2, FiPlus, FiShield } from 'react-icons/fi'
import './AdminDashboard.css'

export default function AdminDashboard() {
    const dispatch = useDispatch()
    const { allUsers, error: userError, message: userMsg } = useSelector(s => s.user)
    const { products, error: prodError, message: prodMsg } = useSelector(s => s.product)
    const [tab, setTab] = useState('users')
    const [showAddProduct, setShowAddProduct] = useState(false)
    const [newProduct, setNewProduct] = useState({ name: '', price: '', description: '', stock: '', category: 'Electronics', images: [{ public_id: 'default', url: '' }] })

    useEffect(() => {
        dispatch(getAllUsersAdmin())
        dispatch(fetchAllProducts({}))
    }, [dispatch])

    useEffect(() => { if (userError) { toast.error(userError); dispatch(clearError()) } }, [userError])
    useEffect(() => { if (userMsg) { toast.success(userMsg); dispatch(clearMessage()) } }, [userMsg])
    useEffect(() => { if (prodError) { toast.error(prodError) } }, [prodError])
    useEffect(() => { if (prodMsg) { toast.success(prodMsg) } }, [prodMsg])

    const handleToggleRole = (user) => {
        const newRole = user.role === 'admin' ? 'user' : 'admin'
        dispatch(updateUserRoleAdmin({ id: user._id, data: { role: newRole } }))
            .then(() => dispatch(getAllUsersAdmin()))
    }

    const handleDeleteUser = (id) => {
        if (window.confirm('Delete this user?')) dispatch(deleteUserAdmin(id))
    }

    const handleDeleteProduct = (id) => {
        if (window.confirm('Delete this product?')) dispatch(deleteProductAdmin(id))
    }

    const handleAddProduct = async (e) => {
        e.preventDefault()
        const data = { ...newProduct, price: Number(newProduct.price), stock: Number(newProduct.stock) }
        const result = await dispatch(addProductAdmin(data))
        if (addProductAdmin.fulfilled.match(result)) {
            toast.success('Product added!'); setShowAddProduct(false)
            setNewProduct({ name: '', price: '', description: '', stock: '', category: 'Electronics', images: [{ public_id: 'default', url: '' }] })
        }
    }

    const CATEGORIES = ['Mobile', 'Electronics', 'Clothing', 'Home & Garden', 'Automotive', 'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media', 'Jewelry', 'Food & Grocery', 'Furniture', 'Shoes', 'Pet Supplies', 'Office Supplies', 'Baby & Kids', 'Art & Collectibles', 'Travel & Luggage', 'Music Instruments', 'Electrical Appliances', 'Handmade Crafts']

    return (
        <div className="page-wrapper">
            <div className="container">
                <div className="admin-header">
                    <div>
                        <h1 className="section-title">Admin Dashboard</h1>
                        <p className="section-subtitle">Manage your store</p>
                    </div>
                </div>

                <div className="admin-stats">
                    <div className="stat-card glass-card"><FiUsers className="stat-icon blue" /><div><span className="stat-num">{allUsers.length}</span><span className="stat-lbl">Total Users</span></div></div>
                    <div className="stat-card glass-card"><FiPackage className="stat-icon violet" /><div><span className="stat-num">{products.length}</span><span className="stat-lbl">Products</span></div></div>
                    <div className="stat-card glass-card"><FiShield className="stat-icon cyan" /><div><span className="stat-num">{allUsers.filter(u => u.role === 'admin').length}</span><span className="stat-lbl">Admins</span></div></div>
                </div>

                <div className="admin-tabs">
                    <button id="admin-tab-users" className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}><FiUsers /> Users</button>
                    <button id="admin-tab-products" className={tab === 'products' ? 'active' : ''} onClick={() => setTab('products')}><FiPackage /> Products</button>
                </div>

                {tab === 'users' && (
                    <div className="admin-table-wrap glass-card">
                        <table className="data-table" id="admin-users-table">
                            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Actions</th></tr></thead>
                            <tbody>
                                {allUsers.map(user => (
                                    <tr key={user._id}>
                                        <td style={{ fontWeight: 600 }}>{user.name}</td>
                                        <td style={{ color: 'var(--text-secondary)' }}>{user.email}</td>
                                        <td><span className={`badge ${user.role === 'admin' ? 'badge-blue' : 'badge-yellow'}`}>{user.role}</span></td>
                                        <td>
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button className="btn btn-outline" style={{ padding: '4px 12px', fontSize: '0.8rem' }} id={`toggle-role-${user._id}`} onClick={() => handleToggleRole(user)}>
                                                    {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                                                </button>
                                                <button className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.8rem' }} id={`delete-user-${user._id}`} onClick={() => handleDeleteUser(user._id)}>
                                                    <FiTrash2 size={13} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === 'products' && (
                    <>
                        <div className="admin-products-header">
                            <button className="btn btn-primary" id="add-product-btn" onClick={() => setShowAddProduct(!showAddProduct)}>
                                <FiPlus /> Add Product
                            </button>
                        </div>
                        {showAddProduct && (
                            <form id="add-product-form" className="add-product-form glass-card" onSubmit={handleAddProduct}>
                                <h3 style={{ marginBottom: '20px', fontWeight: 700 }}>New Product</h3>
                                <div className="add-product-grid">
                                    <div className="form-group"><label>Name</label><input className="form-input" required value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} id="product-name-input" /></div>
                                    <div className="form-group"><label>Price (₹)</label><input className="form-input" type="number" required value={newProduct.price} onChange={e => setNewProduct({ ...newProduct, price: e.target.value })} id="product-price-input" /></div>
                                    <div className="form-group"><label>Stock</label><input className="form-input" type="number" required value={newProduct.stock} onChange={e => setNewProduct({ ...newProduct, stock: e.target.value })} id="product-stock-input" /></div>
                                    <div className="form-group"><label>Category</label>
                                        <select className="form-input" value={newProduct.category} onChange={e => setNewProduct({ ...newProduct, category: e.target.value })} id="product-category-select">
                                            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Image URL</label><input className="form-input" placeholder="https://..." value={newProduct.images[0].url} onChange={e => setNewProduct({ ...newProduct, images: [{ public_id: 'default', url: e.target.value }] })} id="product-image-input" /></div>
                                    <div className="form-group" style={{ gridColumn: '1/-1' }}><label>Description</label><textarea className="form-input" rows={3} required value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })} id="product-desc-input" /></div>
                                </div>
                                <button type="submit" className="btn btn-primary" id="submit-product-btn">Add Product</button>
                            </form>
                        )}
                        <div className="admin-table-wrap glass-card" style={{ marginTop: '20px' }}>
                            <table className="data-table" id="admin-products-table">
                                <thead><tr><th>Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Rating</th><th>Actions</th></tr></thead>
                                <tbody>
                                    {products.map(p => (
                                        <tr key={p._id}>
                                            <td style={{ fontWeight: 600, maxWidth: '200px' }}>{p.name}</td>
                                            <td><span className="badge badge-blue">{p.category}</span></td>
                                            <td>₹{p.price?.toLocaleString('en-IN')}</td>
                                            <td><span className={`badge ${p.stock > 0 ? 'badge-green' : 'badge-red'}`}>{p.stock}</span></td>
                                            <td style={{ color: 'var(--warning)' }}>★ {p.rating?.toFixed(1)}</td>
                                            <td>
                                                <button className="btn btn-danger" style={{ padding: '4px 12px', fontSize: '0.8rem' }} id={`delete-product-${p._id}`} onClick={() => handleDeleteProduct(p._id)}>
                                                    <FiTrash2 size={13} /> Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
