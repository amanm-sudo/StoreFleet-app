import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { fetchProductDetails, rateProduct, deleteReview } from '../redux/slices/productSlice'
import { addToCart } from '../redux/slices/cartSlice'
import { FiStar, FiShoppingCart, FiTrash2, FiArrowLeft } from 'react-icons/fi'
import { toast } from 'react-toastify'
import './ProductDetail.css'

export default function ProductDetail() {
    const { id } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { productDetail, loading } = useSelector(s => s.product)
    const { user, isAuthenticated } = useSelector(s => s.user)

    const [qty, setQty] = useState(1)
    const [rating, setRating] = useState(5)
    const [comment, setComment] = useState('')
    const [hoverRating, setHoverRating] = useState(0)
    const [activeImg, setActiveImg] = useState(0)

    useEffect(() => {
        dispatch(fetchProductDetails(id))
        setActiveImg(0)
    }, [dispatch, id])

    const handleAddToCart = () => {
        if (!productDetail.stock) { toast.error('Out of stock'); return }
        const imgUrl = productDetail.images?.[0]?.url || ''
        dispatch(addToCart({
            productId: productDetail._id,
            name: productDetail.name,
            price: productDetail.price,
            image: imgUrl,
            stock: productDetail.stock,
            quantity: qty,
        }))
        toast.success(`${productDetail.name} added to cart!`)
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault()
        if (!isAuthenticated) { toast.error('Login to submit a review'); return }
        const result = await dispatch(rateProduct({ id, data: { rating, comment } }))
        if (rateProduct.fulfilled.match(result)) {
            toast.success('Review submitted!'); setComment(''); setRating(5)
        } else {
            toast.error(result.payload || 'Failed to submit review')
        }
    }

    const handleDeleteReview = async (reviewId) => {
        const result = await dispatch(deleteReview({ productId: id, reviewId }))
        if (deleteReview.fulfilled.match(result)) {
            toast.success('Review deleted!'); dispatch(fetchProductDetails(id))
        } else {
            toast.error(result.payload || 'Failed to delete review')
        }
    }

    if (loading) return <div className="spinner-wrapper"><div className="spinner"></div></div>
    if (!productDetail) return null

    const images = productDetail.images?.length ? productDetail.images : [{ url: `https://via.placeholder.com/500x400/1a2744/3b82f6?text=${encodeURIComponent(productDetail.name)}` }]

    return (
        <div className="page-wrapper">
            <div className="container">
                <button onClick={() => navigate(-1)} className="back-btn" id="product-back-btn">
                    <FiArrowLeft /> Back
                </button>

                <div className="product-detail-grid">
                    {/* Images */}
                    <div className="product-images">
                        <div className="main-img-wrap">
                            <img src={images[activeImg]?.url} alt={productDetail.name} className="main-img" />
                        </div>
                        {images.length > 1 && (
                            <div className="thumb-strip">
                                {images.map((img, i) => (
                                    <img
                                        key={i} src={img.url} alt=""
                                        className={`thumb ${i === activeImg ? 'active' : ''}`}
                                        onClick={() => setActiveImg(i)}
                                    />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Info */}
                    <div className="product-detail-info">
                        <span className="badge badge-blue" style={{ marginBottom: '12px' }}>{productDetail.category}</span>
                        <h1 className="product-detail-name">{productDetail.name}</h1>

                        <div className="detail-rating">
                            {[1, 2, 3, 4, 5].map(s => (
                                <FiStar key={s} className={s <= Math.round(productDetail.rating) ? 'star filled' : 'star'} />
                            ))}
                            <span>({productDetail.reviews?.length || 0} reviews)</span>
                        </div>

                        <div className="detail-price">₹{productDetail.price?.toLocaleString('en-IN')}</div>

                        <p className="detail-desc">{productDetail.description}</p>

                        <div className={`stock-badge ${productDetail.stock > 0 ? 'in-stock' : 'oos'}`}>
                            {productDetail.stock > 0 ? `✓ In Stock (${productDetail.stock} left)` : '✗ Out of Stock'}
                        </div>

                        {productDetail.stock > 0 && (
                            <div className="detail-actions">
                                <div className="qty-control">
                                    <button id="qty-minus" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
                                    <span>{qty}</span>
                                    <button id="qty-plus" onClick={() => setQty(Math.min(productDetail.stock, qty + 1))}>+</button>
                                </div>
                                <button className="btn btn-primary" id="detail-add-cart-btn" onClick={handleAddToCart} style={{ flex: 1 }}>
                                    <FiShoppingCart /> Add to Cart
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reviews */}
                <div className="reviews-section">
                    <h2 className="section-title">Customer Reviews</h2>

                    {/* Write review */}
                    {isAuthenticated && (
                        <form className="review-form glass-card" onSubmit={handleReviewSubmit} id="review-form">
                            <h3>Write a Review</h3>
                            <div className="star-picker">
                                {[1, 2, 3, 4, 5].map(s => (
                                    <button
                                        type="button" key={s}
                                        className={`star-btn ${s <= (hoverRating || rating) ? 'active' : ''}`}
                                        onClick={() => setRating(s)}
                                        onMouseEnter={() => setHoverRating(s)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    >★</button>
                                ))}
                                <span style={{ marginLeft: '8px', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{rating}/5</span>
                            </div>
                            <textarea
                                id="review-comment"
                                className="form-input"
                                rows={3}
                                placeholder="Share your experience with this product..."
                                value={comment}
                                onChange={e => setComment(e.target.value)}
                            />
                            <button type="submit" className="btn btn-primary" id="submit-review-btn">Submit Review</button>
                        </form>
                    )}

                    {/* Reviews list */}
                    <div className="reviews-list">
                        {productDetail.reviews?.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)' }}>No reviews yet. Be the first!</p>
                        ) : (
                            productDetail.reviews?.map((rev, i) => (
                                <div className="review-card glass-card" key={i} id={`review-${rev._id}`}>
                                    <div className="review-header">
                                        <div className="reviewer-avatar">{rev.name?.[0]?.toUpperCase()}</div>
                                        <div>
                                            <div className="reviewer-name">{rev.name}</div>
                                            <div className="review-stars">
                                                {[1, 2, 3, 4, 5].map(s => <span key={s} className={s <= rev.rating ? 'star' : 'star dim'}>★</span>)}
                                            </div>
                                        </div>
                                        {user?._id?.toString() === rev.user?.toString() && (
                                            <button
                                                className="btn btn-danger"
                                                id={`delete-review-${rev._id}`}
                                                onClick={() => handleDeleteReview(rev._id)}
                                                style={{ marginLeft: 'auto', padding: '6px 12px', fontSize: '0.8rem' }}
                                            >
                                                <FiTrash2 size={14} /> Delete
                                            </button>
                                        )}
                                    </div>
                                    {rev.comment && <p className="review-comment">{rev.comment}</p>}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
