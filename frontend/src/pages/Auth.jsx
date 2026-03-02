import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, registerUser, forgetPassword, clearError, clearMessage } from '../redux/slices/userSlice'
import { toast } from 'react-toastify'
import { FiMail, FiLock, FiUser, FiArrowLeft, FiSend } from 'react-icons/fi'
import './Auth.css'

export default function Auth() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const { loading, error, isAuthenticated, message } = useSelector(s => s.user)
    // view: 'login' | 'register' | 'forgot'
    const [view, setView] = useState('login')
    const [loginData, setLoginData] = useState({ email: '', password: '' })
    const [regData, setRegData] = useState({ name: '', email: '', password: '' })
    const [forgotEmail, setForgotEmail] = useState('')
    const [forgotSent, setForgotSent] = useState(false)

    useEffect(() => {
        if (isAuthenticated) navigate('/')
    }, [isAuthenticated])

    useEffect(() => {
        if (error) { toast.error(error); dispatch(clearError()) }
    }, [error])

    useEffect(() => {
        if (message) { toast.success(message); dispatch(clearMessage()) }
    }, [message])

    const handleLogin = async (e) => {
        e.preventDefault()
        const result = await dispatch(loginUser(loginData))
        if (loginUser.fulfilled.match(result)) {
            toast.success('Welcome back!'); navigate('/')
        }
    }

    const handleRegister = async (e) => {
        e.preventDefault()
        const result = await dispatch(registerUser(regData))
        if (registerUser.fulfilled.match(result)) {
            toast.success('Welcome to StoreFleet!'); navigate('/')
        }
    }

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        const result = await dispatch(forgetPassword({ email: forgotEmail }))
        if (forgetPassword.fulfilled.match(result)) {
            setForgotSent(true)
        }
    }

    const isAuthTab = view === 'login' || view === 'register'

    return (
        <div className="page-wrapper auth-page">
            <div className="auth-card glass-card">
                <div className="auth-logo">⚡ Store<span className="gradient-text">Fleet</span></div>

                {/* Tabs — only show for login/register */}
                {isAuthTab && (
                    <div className="auth-tabs">
                        <button id="tab-login" className={view === 'login' ? 'active' : ''} onClick={() => setView('login')}>Login</button>
                        <button id="tab-register" className={view === 'register' ? 'active' : ''} onClick={() => setView('register')}>Register</button>
                        <div className="tab-indicator" style={{ transform: `translateX(${view === 'register' ? '100%' : '0'})` }}></div>
                    </div>
                )}

                {/* ── LOGIN ── */}
                {view === 'login' && (
                    <form id="login-form" onSubmit={handleLogin}>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-icon-wrap">
                                <FiMail className="input-icon" />
                                <input id="login-email" type="email" className="form-input" placeholder="you@example.com" required
                                    value={loginData.email} onChange={e => setLoginData({ ...loginData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="password-label-row">
                                <label>Password</label>
                                <button type="button" id="forgot-password-link" className="forgot-link"
                                    onClick={() => { setView('forgot'); setForgotSent(false) }}>
                                    Forgot Password?
                                </button>
                            </div>
                            <div className="input-icon-wrap">
                                <FiLock className="input-icon" />
                                <input id="login-password" type="password" className="form-input" placeholder="••••••••" required
                                    value={loginData.password} onChange={e => setLoginData({ ...loginData, password: e.target.value })} />
                            </div>
                        </div>
                        <button id="login-submit-btn" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
                            {loading ? 'Signing in...' : 'Sign In'}
                        </button>
                        <div className="auth-switch">
                            Don't have an account? <button type="button" onClick={() => setView('register')}>Register</button>
                        </div>
                    </form>
                )}

                {/* ── REGISTER ── */}
                {view === 'register' && (
                    <form id="register-form" onSubmit={handleRegister}>
                        <div className="form-group">
                            <label>Full Name</label>
                            <div className="input-icon-wrap">
                                <FiUser className="input-icon" />
                                <input id="register-name" type="text" className="form-input" placeholder="John Doe" required
                                    value={regData.name} onChange={e => setRegData({ ...regData, name: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Email</label>
                            <div className="input-icon-wrap">
                                <FiMail className="input-icon" />
                                <input id="register-email" type="email" className="form-input" placeholder="you@example.com" required
                                    value={regData.email} onChange={e => setRegData({ ...regData, email: e.target.value })} />
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Password</label>
                            <div className="input-icon-wrap">
                                <FiLock className="input-icon" />
                                <input id="register-password" type="password" className="form-input" placeholder="••••••••" required minLength={6}
                                    value={regData.password} onChange={e => setRegData({ ...regData, password: e.target.value })} />
                            </div>
                        </div>
                        <button id="register-submit-btn" type="submit" className="btn btn-primary" style={{ width: '100%', padding: '13px' }} disabled={loading}>
                            {loading ? 'Creating account...' : 'Create Account'}
                        </button>
                        <div className="auth-switch">
                            Already have an account? <button type="button" onClick={() => setView('login')}>Login</button>
                        </div>
                    </form>
                )}

                {/* ── FORGOT PASSWORD ── */}
                {view === 'forgot' && (
                    <div className="forgot-section">
                        <button className="back-to-login-btn" id="back-to-login-btn" onClick={() => setView('login')}>
                            <FiArrowLeft size={14} /> Back to Login
                        </button>

                        {forgotSent ? (
                            <div className="forgot-success">
                                <div className="forgot-success-icon">📬</div>
                                <h3>Check your inbox!</h3>
                                <p>We sent a reset link to <strong>{forgotEmail}</strong>. Click the link in the email to reset your password.</p>
                                <p className="forgot-note">
                                    Didn't receive it? Check spam or{' '}
                                    <button type="button" onClick={() => setForgotSent(false)} className="resend-btn">try again.</button>
                                </p>
                            </div>
                        ) : (
                            <form id="forgot-password-form" onSubmit={handleForgotPassword}>
                                <div className="forgot-header">
                                    <h3>Forgot Password?</h3>
                                    <p>Enter your registered email and we'll send you a reset link.</p>
                                </div>
                                <div className="form-group">
                                    <label>Email Address</label>
                                    <div className="input-icon-wrap">
                                        <FiMail className="input-icon" />
                                        <input
                                            id="forgot-email-input"
                                            type="email"
                                            className="form-input"
                                            placeholder="you@example.com"
                                            required
                                            value={forgotEmail}
                                            onChange={e => setForgotEmail(e.target.value)}
                                        />
                                    </div>
                                </div>
                                <button id="send-reset-link-btn" type="submit" className="btn btn-primary"
                                    style={{ width: '100%', padding: '13px' }} disabled={loading}>
                                    {loading ? 'Sending...' : <><FiSend size={15} style={{ marginRight: '6px' }} /> Send Reset Link</>}
                                </button>
                            </form>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
