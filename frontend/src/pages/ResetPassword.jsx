import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { resetPassword, clearError, clearMessage } from '../redux/slices/userSlice'
import { toast } from 'react-toastify'
import { FiLock, FiArrowLeft } from 'react-icons/fi'
import './Auth.css'

export default function ResetPassword() {
    const { token } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, message } = useSelector(s => s.user)

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()) }
    }, [error])

    useEffect(() => {
        if (message) {
            toast.success(message)
            dispatch(clearMessage())
            navigate('/auth')
        }
    }, [message])

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error('Passwords do not match')
            return
        }
        dispatch(resetPassword({ token, data: { password, confirmPassword } }))
    }

    return (
        <div className="page-wrapper auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">⚡ Store<span className="gradient-text">Fleet</span></div>

                <button className="back-to-login-btn" onClick={() => navigate('/auth')} style={{ marginBottom: '20px' }}>
                    <FiArrowLeft size={14} /> Back to Login
                </button>

                <div className="forgot-header">
                    <h3>Reset Your Password</h3>
                    <p>Choose a new strong password for your account.</p>
                </div>

                <form id="reset-password-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>New Password</label>
                        <div className="input-icon-wrap">
                            <FiLock className="input-icon" />
                            <input
                                id="reset-new-password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Confirm New Password</label>
                        <div className="input-icon-wrap">
                            <FiLock className="input-icon" />
                            <input
                                id="reset-confirm-password"
                                type="password"
                                className="form-input"
                                placeholder="••••••••"
                                required
                                minLength={6}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Password match indicator */}
                    {confirmPassword && (
                        <p style={{
                            fontSize: '0.8rem',
                            marginBottom: '12px',
                            color: password === confirmPassword ? 'var(--success)' : 'var(--danger)'
                        }}>
                            {password === confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
                        </p>
                    )}

                    <button
                        id="reset-password-submit-btn"
                        type="submit"
                        className="btn btn-primary"
                        style={{ width: '100%', padding: '13px' }}
                        disabled={loading || (confirmPassword && password !== confirmPassword)}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    )
}
