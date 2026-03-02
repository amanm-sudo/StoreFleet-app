import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const registerUser = createAsyncThunk('user/register', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/storefleet/user/signup', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const loginUser = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/storefleet/user/login', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const logoutUser = createAsyncThunk('user/logout', async (_, { rejectWithValue }) => {
    try {
        await axios.get('/api/storefleet/user/logout', { withCredentials: true })
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const loadUser = createAsyncThunk('user/load', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/storefleet/user/details', { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const updateProfile = createAsyncThunk('user/updateProfile', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.put('/api/storefleet/user/profile/update', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const updatePassword = createAsyncThunk('user/updatePassword', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.put('/api/storefleet/user/password/update', data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const forgetPassword = createAsyncThunk('user/forgetPassword', async (data, { rejectWithValue }) => {
    try {
        const res = await axios.post('/api/storefleet/user/password/forget', data)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const resetPassword = createAsyncThunk('user/resetPassword', async ({ token, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/storefleet/user/password/reset/${token}`, data)
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const getAllUsersAdmin = createAsyncThunk('user/getAllAdmin', async (_, { rejectWithValue }) => {
    try {
        const res = await axios.get('/api/storefleet/user/admin/allusers', { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const updateUserRoleAdmin = createAsyncThunk('user/updateRoleAdmin', async ({ id, data }, { rejectWithValue }) => {
    try {
        const res = await axios.put(`/api/storefleet/user/admin/update/${id}`, data, { withCredentials: true })
        return res.data
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

export const deleteUserAdmin = createAsyncThunk('user/deleteAdmin', async (id, { rejectWithValue }) => {
    try {
        await axios.delete(`/api/storefleet/user/admin/delete/${id}`, { withCredentials: true })
        return id
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || err.message)
    }
})

const userSlice = createSlice({
    name: 'user',
    initialState: {
        user: null,
        isAuthenticated: false,
        loading: false,
        error: null,
        message: null,
        allUsers: [],
    },
    reducers: {
        clearError: (state) => { state.error = null },
        clearMessage: (state) => { state.message = null },
    },
    extraReducers: (builder) => {
        const pending = (state) => { state.loading = true; state.error = null }
        const rejected = (state, action) => { state.loading = false; state.error = action.payload }

        builder
            .addCase(registerUser.pending, pending)
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false; state.isAuthenticated = true; state.user = action.payload.newUser
            })
            .addCase(registerUser.rejected, rejected)

            .addCase(loginUser.pending, pending)
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false; state.isAuthenticated = true; state.user = action.payload.user
            })
            .addCase(loginUser.rejected, rejected)

            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null; state.isAuthenticated = false
            })

            .addCase(loadUser.pending, pending)
            .addCase(loadUser.fulfilled, (state, action) => {
                state.loading = false; state.isAuthenticated = true; state.user = action.payload.userDetails
            })
            .addCase(loadUser.rejected, (state) => {
                state.loading = false; state.isAuthenticated = false; state.user = null
            })

            .addCase(updateProfile.pending, pending)
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false; state.user = action.payload.updatedUserDetails; state.message = 'Profile updated!'
            })
            .addCase(updateProfile.rejected, rejected)

            .addCase(updatePassword.fulfilled, (state) => {
                state.loading = false; state.message = 'Password updated!'
            })
            .addCase(updatePassword.rejected, rejected)

            .addCase(forgetPassword.pending, pending)
            .addCase(forgetPassword.fulfilled, (state, action) => {
                state.loading = false; state.message = action.payload.msg
            })
            .addCase(forgetPassword.rejected, rejected)

            .addCase(resetPassword.pending, pending)
            .addCase(resetPassword.fulfilled, (state) => {
                state.loading = false; state.message = 'Password reset successfully!'
            })
            .addCase(resetPassword.rejected, rejected)

            .addCase(getAllUsersAdmin.pending, pending)
            .addCase(getAllUsersAdmin.fulfilled, (state, action) => {
                state.loading = false; state.allUsers = action.payload.allUsers
            })
            .addCase(getAllUsersAdmin.rejected, rejected)

            .addCase(updateUserRoleAdmin.fulfilled, (state) => {
                state.loading = false; state.message = 'User role updated!'
            })

            .addCase(deleteUserAdmin.fulfilled, (state, action) => {
                state.allUsers = state.allUsers.filter(u => u._id !== action.payload)
            })
    },
})

export const { clearError, clearMessage } = userSlice.actions
export default userSlice.reducer
