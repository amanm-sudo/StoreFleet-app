import React, { useEffect, useState, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchAllProducts } from '../redux/slices/productSlice'
import ProductCard from '../components/ProductCard'
import { FiSearch, FiFilter, FiX } from 'react-icons/fi'
import './Products.css'

const CATEGORIES = [
    'Mobile', 'Electronics', 'Clothing', 'Home & Garden', 'Automotive',
    'Health & Beauty', 'Sports & Outdoors', 'Toys & Games', 'Books & Media',
    'Jewelry', 'Food & Grocery', 'Furniture', 'Shoes', 'Pet Supplies',
    'Office Supplies', 'Baby & Kids', 'Art & Collectibles', 'Travel & Luggage',
    'Music Instruments', 'Electrical Appliances', 'Handmade Crafts',
]

export default function Products() {
    const dispatch = useDispatch()
    const [searchParams, setSearchParams] = useSearchParams()
    const { products, loading, filteredProductsCount, resultPerPage } = useSelector(s => s.product)

    const [keyword, setKeyword] = useState(searchParams.get('keyword') || '')
    const [category, setCategory] = useState(searchParams.get('category') || '')
    const [minPrice, setMinPrice] = useState('')
    const [maxPrice, setMaxPrice] = useState('')
    const [page, setPage] = useState(1)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const totalPages = Math.ceil(filteredProductsCount / resultPerPage) || 1

    const doFetch = useCallback(() => {
        dispatch(fetchAllProducts({ keyword, category, minPrice, maxPrice, page }))
        const params = {}
        if (keyword) params.keyword = keyword
        if (category) params.category = category
        setSearchParams(params)
    }, [dispatch, keyword, category, minPrice, maxPrice, page])

    useEffect(() => { doFetch() }, [page])

    const handleSearch = (e) => { e.preventDefault(); setPage(1); doFetch() }

    const clearFilters = () => {
        setKeyword(''); setCategory(''); setMinPrice(''); setMaxPrice(''); setPage(1)
        dispatch(fetchAllProducts({}))
        setSearchParams({})
    }

    return (
        <div className="page-wrapper">
            <div className="container products-layout">
                {/* Sidebar */}
                <aside className={`filter-sidebar glass-card ${sidebarOpen ? 'open' : ''}`}>
                    <div className="sidebar-header">
                        <h3>Filters</h3>
                        <button onClick={clearFilters} className="clear-filters-btn"><FiX size={14} /> Clear</button>
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className="filter-group">
                            <label>Search</label>
                            <div className="search-input-wrap">
                                <FiSearch className="search-icon" />
                                <input
                                    id="products-search-input"
                                    className="form-input"
                                    placeholder="Search products..."
                                    value={keyword}
                                    onChange={e => setKeyword(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="filter-group">
                            <label>Category</label>
                            <select
                                id="products-category-select"
                                className="form-input"
                                value={category}
                                onChange={e => setCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label>Price Range</label>
                            <div className="price-inputs">
                                <input className="form-input" placeholder="Min ₹" value={minPrice} onChange={e => setMinPrice(e.target.value)} type="number" id="min-price-input" />
                                <span>—</span>
                                <input className="form-input" placeholder="Max ₹" value={maxPrice} onChange={e => setMaxPrice(e.target.value)} type="number" id="max-price-input" />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary" id="apply-filter-btn" style={{ width: '100%', marginTop: '8px' }}>
                            Apply Filters
                        </button>
                    </form>
                </aside>

                {/* Main */}
                <main className="products-main">
                    <div className="products-toolbar">
                        <div className="toolbar-info">
                            <h2 className="section-title" style={{ marginBottom: 0 }}>Products</h2>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                                Showing {products.length} of {filteredProductsCount || 0} results
                            </p>
                        </div>
                        <button className="btn btn-outline filter-toggle-btn" id="filter-toggle-btn" onClick={() => setSidebarOpen(!sidebarOpen)}>
                            <FiFilter /> Filters
                        </button>
                    </div>

                    {loading ? (
                        <div className="spinner-wrapper"><div className="spinner"></div></div>
                    ) : products.length === 0 ? (
                        <div className="no-products">
                            <span>😕</span>
                            <p>No products found. Try different filters.</p>
                            <button className="btn btn-outline" onClick={clearFilters}>Clear Filters</button>
                        </div>
                    ) : (
                        <div className="products-grid-main">
                            {products.map(product => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="pagination">
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    className={page === i + 1 ? 'active' : ''}
                                    id={`page-btn-${i + 1}`}
                                    onClick={() => setPage(i + 1)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    )
}
