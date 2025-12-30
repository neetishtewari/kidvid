import { motion } from 'framer-motion';
import { BarChart2, Heart, Shield } from 'lucide-react';
import './FeaturesGrid.css';

export default function FeaturesGrid() {
    return (
        <section className="features-section">
            <div className="container">
                <div className="section-header">
                    <motion.div
                        className="badge"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <span>New Features</span>
                    </motion.div>
                    <h2 className="section-title">Built for Modern Parenting</h2>
                    <p className="section-subtitle">We just shipped powerful new tools to give you even more control and insight.</p>
                </div>

                <div className="grid-container">
                    {/* Feature 1: Likes */}
                    <motion.div
                        className="grid-item item-large"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <div className="grid-content">
                            <div className="icon-badge teal"><Heart size={24} /></div>
                            <h3>Kid Favorites</h3>
                            <p>Kids can now "Like" videos. They build a library of favorites, you get to see what they love.</p>
                        </div>
                        <div className="grid-visual visual-likes">
                            <div className="mock-card">
                                <div className="mock-video"></div>
                                <div className="mock-like-btn">❤️ Liked</div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Feature 2: Analytics */}
                    <motion.div
                        className="grid-item item-tall"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="grid-visual visual-graph">
                            <div className="bar-graph">
                                <div className="bar" style={{ height: '40%' }}></div>
                                <div className="bar" style={{ height: '70%' }}></div>
                                <div className="bar" style={{ height: '50%' }}></div>
                                <div className="bar active" style={{ height: '85%' }}></div>
                                <div className="bar" style={{ height: '60%' }}></div>
                            </div>
                        </div>
                        <div className="grid-content">
                            <div className="icon-badge coral"><BarChart2 size={24} /></div>
                            <h3>Usage Insights</h3>
                            <p>See viewing habits and top categories at a glance in your dashboard.</p>
                        </div>
                    </motion.div>

                    {/* Feature 3: Safety */}
                    <motion.div
                        className="grid-item"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="grid-content">
                            <div className="icon-badge blue"><Shield size={24} /></div>
                            <h3>100% Ad-Free</h3>
                            <p>No interruptions. No selling to kids.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
