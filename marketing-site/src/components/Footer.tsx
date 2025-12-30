import { Facebook, Instagram, Twitter } from 'lucide-react';
import './Footer.css';

export default function Footer() {
    return (
        <footer className="footer-container">
            <div className="container">
                <div className="footer-content">
                    <div className="footer-brand">
                        <h3>KidVid</h3>
                        <p>The safe scrolling experience for the next generation.</p>
                    </div>
                    <div className="footer-links">
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                        <a href="#">Parent Guide</a>
                    </div>
                    <div className="footer-social">
                        <a href="#"><Twitter size={20} /></a>
                        <a href="#"><Instagram size={20} /></a>
                        <a href="#"><Facebook size={20} /></a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} KidVid Inc. Built with care for our own kids.</p>
                </div>
            </div>
        </footer>
    );
}
