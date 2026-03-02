import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const placeOrder = createAsyncThunk('order/place', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/storefleet/order/new', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const fetchMyOrders = createAsyncThunk('order/myOrders', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/storefleet/order/myorders', { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

const orderSlice = createSlice({
    name: 'order',
    initialState: {
        order: null,
        myOrders: [],
        loading: false,
        error: null,
        message: null,
    },
    reducers: {
        clearOrderError: (state) => { state.error = null },
        clearOrderMessage: (state) => { state.message = null },
    },
    extraReducers: (builder) => {
        builder
            .addCase(placeOrder.pending, (state) => { state.loading = true; state.error = null })
            .addCase(placeOrder.fulfilled, (state, action) => {
                state.loading = false; state.order = action.payload.order; state.message = 'Order placed!'
            })
            .addCase(placeOrder.rejected, (state, action) => {
                state.loading = false; state.error = action.payload
            })
            .addCase(fetchMyOrders.pending, (state) => { state.loading = true })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.loading = false; state.myOrders = action.payload.myOrders || []
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.loading = false; state.error = action.payload
            })
    },
})

export const { clearOrderError, clearOrderMessage } = orderSlice.actions
export default orderSlice.reducer
