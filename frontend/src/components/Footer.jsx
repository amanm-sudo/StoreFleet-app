import React from 'react'
import { Link } from 'react-router-dom'
import { FiGithub, FiTwitter, FiLinkedin } from 'react-icons/fi'
import './Footer.css'

export default function Footer() {
    return (
        <footer className="footer">
            <div className="container footer-inner">
                <div className="footer-brand">
                    <span className="footer-logo">⚡ Store<span className="gradient-text">Fleet</span></span>
                    <p>Your premium e-commerce destination. Fast shipping, quality products, outstanding service.</p>
                </div>
                <div className="footer-links">
                    <h4>Quick Links</h4>
                    <Link to="/">Home</Link>
                    <Link to="/products">Products</Link>
                    <Link to="/cart">Cart</Link>
                    <Link to="/auth">Login</Link>
                </div>
                <div className="footer-links">
                    <h4>Account</h4>
                    <Link to="/profile">Profile</Link>
                    <Link to="/orders">My Orders</Link>
                    <Link to="/auth">Register</Link>
                </div>
                <div className="footer-social">
                    <h4>Connect</h4>
                    <div className="social-icons">
                        <a href="#" aria-label="GitHub"><FiGithub /></a>
                        <a href="#" aria-label="Twitter"><FiTwitter /></a>
                        <a href="#" aria-label="LinkedIn"><FiLinkedin /></a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="container">
                    <p>© 2024 StoreFleet. Built for the Coding Ninjas Capstone.</p>
                </div>
            </div>
        </footer>
    )
}
