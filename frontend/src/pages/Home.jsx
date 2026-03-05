import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield } from 'react-icons/fi'
import './Home.css'

const categories = [
    { name: 'Electronics', emoji: '💻', slug: 'laptops' },
    { name: 'Mobile', emoji: '📱', slug: 'smartphones' },
    { name: 'Clothing', emoji: '👗', slug: 'mens-shirts' },
    { name: 'Shoes', emoji: '👟', slug: 'mens-shoes' },
    { name: 'Groceries', emoji: '🛒', slug: 'groceries' },
    { name: 'Jewelry', emoji: '💎', slug: 'womens-jewellery' },
    { name: 'Sports', emoji: '⚽', slug: 'sports-accessories' },
    { name: 'Home Decoration', emoji: '🏡', slug: 'home-decoration' },
]

export default function Home() {
    const dispatch = useDispatch()
    const { products, loading } = useSelector(s => s.product)

    useEffect(() => {
        dispatch(fetchAllProducts({ page: 1 }))
    }, [dispatch])

    return (
        <div className="home-page">
            {/* Hero */}
            <section className="hero">
                <div className="hero-bg-orbs">
                    <div className="orb orb1"></div>
                    <div className="orb orb2"></div>
                </div>
                <div className="container hero-content">
                    <div className="hero-badge">🚀 Free shipping on orders above ₹499</div>
                    <h1 className="hero-title">
                        Shop the <span className="gradient-text">Future</span> of Retail
                    </h1>
                    <p className="hero-subtitle">
                        Discover thousands of premium products across all categories. Fast delivery, easy returns, and unbeatable prices.
                    </p>
                    <div className="hero-actions">
                        <Link to="/products" className="btn btn-primary" id="hero-shop-btn">
                            Shop Now <FiArrowRight />
                        </Link>
                        <Link to="/auth" className="btn btn-outline" id="hero-signup-btn">
                            Get Started
                        </Link>
                    </div>
                    <div className="hero-stats">
                        <div className="stat"><span className="stat-num">10K+</span><span className="stat-label">Products</span></div>
                        <div className="stat"><span className="stat-num">50K+</span><span className="stat-label">Customers</span></div>
                        <div className="stat"><span className="stat-num">99%</span><span className="stat-label">Satisfaction</span></div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="features-section">
                <div className="container features-grid">
                    {[
                        { icon: <FiShoppingBag />, title: 'Wide Selection', desc: '10,000+ products across 20 categories' },
                        { icon: <FiTruck />, title: 'Fast Delivery', desc: 'Express shipping in 2-3 business days' },
                        { icon: <FiShield />, title: 'Secure Payments', desc: '100% safe and encrypted transactions' },
                    ].map((f, i) => (
                        <div className="feature-card glass-card" key={i}>
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Categories */}
            <section className="categories-section">
                <div className="container">
                    <h2 className="section-title">Browse Categories</h2>
                    <p className="section-subtitle">Find exactly what you're looking for</p>
                    <div className="categories-grid">
                        {categories.map(cat => (
                            <Link
                                to={`/products?category=${encodeURIComponent(cat.slug)}`}
                                className="category-card glass-card"
                                key={cat.name}
                                id={`cat-${cat.name.replace(/\s+/g, '-').toLowerCase()}`}
                            >
                                <span className="cat-emoji">{cat.emoji}</span>
                                <span className="cat-name">{cat.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="featured-section">
                <div className="container">
                    <div className="section-header">
                        <div>
                            <h2 className="section-title">Featured Products</h2>
                            <p className="section-subtitle">Handpicked just for you</p>
                        </div>
                        <Link to="/products" className="btn btn-outline" id="view-all-btn">View All <FiArrowRight /></Link>
                    </div>
                    {loading ? (
                        <div className="spinner-wrapper"><div className="spinner"></div></div>
                    ) : (
                        <div className="products-grid">
                            {products.slice(0, 8).map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}
