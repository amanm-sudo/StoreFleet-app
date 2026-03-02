import React from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../redux/slices/cartSlice'
import { FiStar, FiShoppingCart } from 'react-icons/fi'
import { toast } from 'react-toastify'
import './ProductCard.css'

export default function ProductCard({ product }) {
    const dispatch = useDispatch()
    const imgUrl = product.images?.[0]?.url || `https://via.placeholder.com/300x200/1a2744/3b82f6?text=${encodeURIComponent(product.name)}`

    const handleAddToCart = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (product.stock === 0) { toast.error('Out of stock'); return }
        dispatch(addToCart({
            productId: product._id,
            name: product.name,
            price: product.price,
            image: imgUrl,
            stock: product.stock,
            quantity: 1,
        }))
        toast.success('Added to cart!')
    }

    return (
        <Link to={`/product/${product._id}`} className="product-card glass-card" id={`product-card-${product._id}`}>
            <div className="product-img-wrap">
                <img src={imgUrl} alt={product.name} className="product-img" loading="lazy" />
                {product.stock === 0 && <span className="out-of-stock-badge">Out of Stock</span>}
            </div>
            <div className="product-info">
                <span className="product-category badge badge-blue">{product.category}</span>
                <h3 className="product-name">{product.name}</h3>
                <div className="product-rating">
                    {[...Array(5)].map((_, i) => (
                        <FiStar key={i} className={i < Math.round(product.rating) ? 'star filled' : 'star'} />
                    ))}
                    <span className="rating-count">({product.reviews?.length || 0})</span>
                </div>
                <div className="product-footer">
                    <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
                    <button
                        className="add-cart-btn"
                        onClick={handleAddToCart}
                        disabled={product.stock === 0}
                        id={`add-cart-${product._id}`}
                        title="Add to cart"
                    >
                        <FiShoppingCart size={16} />
                    </button>
                </div>
            </div>
        </Link>
    )
}
