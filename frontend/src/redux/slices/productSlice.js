import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchAllProducts = createAsyncThunk('product/fetchAll', async (params = {}, { rejectWithValue }) => {
    try {
        const { keyword = '', category = '', minPrice = '', maxPrice = '', page = 1 } = params
        const query = new URLSearchParams({ keyword, category, minPrice, maxPrice, page }).toString()
        const res = await axios.get(`/api/storefleet/product/products?${query}`)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const fetchProductDetails = createAsyncThunk('product/fetchDetails', async (id, { rejectWithValue }) => {
    try {
        const res = await axios.get(`/api/storefleet/product/products/${id}`)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const rateProduct = createAsyncThunk('product/rate', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/storefleet/product/rate/${id}`, data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const deleteReview = createAsyncThunk('product/deleteReview', async ({ productId, reviewId }, { rejectWithValue }) => {
    try {
        const res = await axios.delete(`/api/storefleet/product/review/delete?productId=${productId}&reviewId=${reviewId}`, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const addProductAdmin = createAsyncThunk('product/addAdmin', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/storefleet/product/admin/add', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const updateProductAdmin = createAsyncThunk('product/updateAdmin', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/storefleet/product/admin/update/${id}`, data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const deleteProductAdmin = createAsyncThunk('product/deleteAdmin', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/storefleet/product/admin/delete/${id}`, { withCredentials: true })
        return id
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

const productSlice = createSlice({
    name: 'product',
    initialState: {
        products: [],
        productDetail: null,
        totalProductCount: 0,
        filteredProductsCount: 0,
        resultPerPage: 8,
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearProductError: (state) => { state.error = null },
        clearProductMessage: (state) => { state.message = null },
    },
    extraReducers: (builder) => {
        const pending = (state) => { state.loading = true; state.error = null }
        const rejected = (state, action) => { state.loading = false; state.error = action.payload }

        builder
            .addCase(fetchAllProducts.pending, pending)
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.loading = false
                state.products = action.payload.products
                state.totalProductCount = action.payload.totalProductCount
                state.filteredProductsCount = action.payload.filteredProductsCount
                state.resultPerPage = action.payload.resultPerPage
            })
            .addCase(fetchAllProducts.rejected, rejected)

            .addCase(fetchProductDetails.pending, pending)
            .addCase(fetchProductDetails.fulfilled, (state, action) => {
                state.loading = false; state.productDetail = action.payload.productDetails
            })
            .addCase(fetchProductDetails.rejected, rejected)

            .addCase(rateProduct.fulfilled, (state, action) => {
                state.productDetail = action.payload.product; state.message = 'Review submitted!'
            })

            .addCase(deleteReview.fulfilled, (state) => {
                state.message = 'Review deleted!'
            })

            .addCase(addProductAdmin.fulfilled, (state, action) => {
                state.message = 'Product added!'; state.products.push(action.payload.product)
            })
            .addCase(addProductAdmin.rejected, rejected)

            .addCase(updateProductAdmin.fulfilled, (state) => {
                state.message = 'Product updated!'
            })

            .addCase(deleteProductAdmin.fulfilled, (state, action) => {
                state.products = state.products.filter(p => p._id !== action.payload)
                state.message = 'Product deleted!'
            })
    },
})

export const { clearProductError, clearProductMessage } = productSlice.actions
export default productSlice.reducer
