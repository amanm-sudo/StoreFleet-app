import { createSlice } from '@reduxjs/toolkit'

const loadCart = () => {
    try {
        const saved = localStorage.getItem('storefleet_cart')
        return saved ? JSON.parse(saved) : []
    } catch { return [] }
}

const saveCart = (items) => {
    localStorage.setItem('storefleet_cart', JSON.stringify(items))
}

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: loadCart(),
    },
    reducers: {
        addToCart: (state, action) => {
            const item = action.payload
            const existing = state.cartItems.find(i => i.productId === item.productId)
            if (existing) {
                existing.quantity = Math.min(existing.quantity + item.quantity, item.stock)
            } else {
                state.cartItems.push(item)
            }
            saveCart(state.cartItems)
        },
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter(i => i.productId !== action.payload)
            saveCart(state.cartItems)
        },
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload
            const item = state.cartItems.find(i => i.productId === productId)
            if (item) item.quantity = quantity
            saveCart(state.cartItems)
        },
        clearCart: (state) => {
            state.cartItems = []
            saveCart([])
        },
    },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions
export default cartSlice.reducer
