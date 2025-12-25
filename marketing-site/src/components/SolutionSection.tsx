import { motion } from 'framer-motion';
import { CheckCircle, Lock, PlayCircle } from 'lucide-react';
import './Section.css';

export default function SolutionSection() {
    return (
        <section className="section-container solution-bg">
            <div className="section-content">
                <motion.h2
                    className="section-title"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    Controlled <span className="text-accent">Chaos</span>
                </motion.h2>
                <p className="section-subtitle">
                    KidVid keeps the "fun" interface kids love, but swaps the engine.
                    You build the playlist. They enjoy the scroll.
                </p>

                <div className="features-list">
                    <motion.div
                        className="feature-row"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="feature-text">
                            <h3><Lock className="inline-icon" /> Parent Gatekeeper</h3>
                            <p>Add YouTube videos by URL. Only approved content gets in.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="feature-row reverse"
                        initial={{ x: 50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="feature-text">
                            <h3><PlayCircle className="inline-icon" /> Immersive Feed</h3>
                            <p>Vertical, auto-play interface. Zero learning curve for kids.</p>
                        </div>
                    </motion.div>

                    <motion.div
                        className="feature-row"
                        initial={{ x: -50, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="feature-text">
                            <h3><CheckCircle className="inline-icon" /> Peace of Mind</h3>
                            <p>No comments. No suggested videos. No rabbit holes.</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
