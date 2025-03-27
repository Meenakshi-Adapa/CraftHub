import React from 'react';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa';
import '../styles/Footer.css';

const Footer = () => {
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">CraftHub</div>
          <div className="footer-tagline">Handmade with passion.</div>
        </div>
        
        <nav className="footer-nav">
          <Link to="/">Home</Link>
          <Link to="/products">Products</Link>
          <Link to="/workshops">Workshops</Link>
          <Link to="/contact">Contact</Link>
        </nav>
        
        <div className="footer-social">
          <a href="https://facebook.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <FaFacebookF />
          </a>
          <a href="https://instagram.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <FaInstagram />
          </a>
          <a href="https://twitter.com" className="social-icon" target="_blank" rel="noopener noreferrer">
            <FaTwitter />
          </a>
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} CraftHub. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;