import { motion } from 'framer-motion';
import { Download, Sparkles } from 'lucide-react';
import './Hero.css';

export default function Hero() {
    return (
        <section className="hero-container">
            <div className="hero-content">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    className="badge"
                >
                    <Sparkles size={16} /> <span>The Tik-Tok for Education</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                >
                    The <span className="highlight">Infinite Scroll</span>,<br />
                    Now <span className="gradient-text">Infinite Learning</span>.
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                >
                    Turn your child's dopamine loop into a learning loop.
                    KidVid gives them the feed they addictively love,
                    controlled by the playlists you Curate.
                </motion.p>

                <motion.div
                    className="cta-group"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6 }}
                >
                    <button className="btn-primary">
                        <Download size={20} /> Download for Android
                    </button>
                    <button className="btn-secondary">
                        View Demo
                    </button>
                </motion.div>
            </div>

            <div className="hero-visual">
                {/* Phone Mockup Animation */}
                <motion.div
                    className="phone-mockup"
                    animate={{ y: [0, -20, 0] }}
                    transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                >
                    <div className="notch"></div>
                    <div className="screen">
                        <div className="video-placeholder gradient-bg">
                            <div className="play-icon">▶</div>
                        </div>
                    </div>
                </motion.div>

                {/* Floating Particles */}
                <motion.div className="particle p1" animate={{ y: [0, -30, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity }} />
                <motion.div className="particle p2" animate={{ y: [0, 40, 0], opacity: [0.5, 1, 0.5] }} transition={{ duration: 5, repeat: Infinity }} />
            </div>
        </section>
    );
}
