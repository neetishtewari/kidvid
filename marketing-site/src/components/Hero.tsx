import { motion } from 'framer-motion';
import { Download, PlayCircle, ShieldCheck } from 'lucide-react';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero-container">
            <div className="container hero-grid">
                <div className="hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="badge"
                    >
                        <ShieldCheck size={16} className="badge-icon" /> <span>Kid-Safe • Parent-Approved</span>
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.1 }}
                        className="hero-title"
                    >
                        The Video Feed <br />
                        <span className="text-gradient">Parents Actually Trust.</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                        className="hero-subtitle"
                    >
                        Give them the scrolling experience they love, controlled entirely by you.
                        No ads. No algorithms. Just the content you curate.
                    </motion.p>

                    <motion.div
                        className="cta-group"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.3 }}
                    >
                        <button className="btn-primary">
                            <Download size={20} /> Download for iOS
                        </button>
                        <button className="btn-secondary">
                            <PlayCircle size={20} /> Watch Demo
                        </button>
                    </motion.div>

                    <motion.div
                        className="trust-badge"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                    >
                        <div className="avatars">
                            {/* Simple circles to represent users */}
                            <div className="avatar" style={{ background: '#CBD5E1' }}></div>
                            <div className="avatar" style={{ background: '#94A3B8' }}></div>
                            <div className="avatar" style={{ background: '#64748B' }}></div>
                        </div>
                        <p>Trusted by 10,000+ Parents</p>
                    </motion.div>
                </div>

                <div className="hero-visual">
                    <motion.div
                        className="app-mockup"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        {/* Abstract representation of the app interface */}
                        <div className="mockup-frame">
                            <div className="mockup-screen">
                                <div className="mockup-header">
                                    <div className="pill">My Playlist</div>
                                </div>
                                <div className="mockup-video">
                                    <div className="play-button">▶</div>
                                </div>
                                <div className="mockup-controls">
                                    <div className="heart-btn">❤️</div>
                                </div>
                            </div>
                        </div>

                        {/* Floating Feature Cards */}
                        <motion.div
                            className="float-card card-left"
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <span className="emoji">🔒</span> Pin Protected
                        </motion.div>
                        <motion.div
                            className="float-card card-right"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                        >
                            <span className="emoji">❤️</span> Kid Favorites
                        </motion.div>
                    </motion.div>

                    <div className="blob blob-1"></div>
                    <div className="blob blob-2"></div>
                </div>
            </div>
        </section>
    );
}
