import { motion } from 'framer-motion';
import { BarChart, CheckCircle, Heart, Lock, PlayCircle } from 'lucide-react';
import './Section.css';

export default function SolutionSection() {
    return (
        <section className="section-container solution-bg">
            <div className="container">
                <div className="section-header">
                    <motion.h2
                        className="section-title"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        Controlled <span className="highlight-teal">Chaos</span>
                    </motion.h2>
                    <p className="section-subtitle">
                        KidVid keeps the "fun" interface kids love, but swaps the engine.
                        You build the playlist. They enjoy the scroll.
                    </p>
                </div>

                <div className="solution-grid">
                    <motion.div
                        className="solution-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                    >
                        <div className="icon-circle"><Lock size={24} /></div>
                        <h3>Parent Gatekeeper</h3>
                        <p>Add YouTube videos by URL or search. Only approved content gets in.</p>
                    </motion.div>

                    <motion.div
                        className="solution-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.1 }}
                    >
                        <div className="icon-circle"><PlayCircle size={24} /></div>
                        <h3>Immersive Feed</h3>
                        <p>Vertical, auto-play interface. Zero learning curve for kids.</p>
                    </motion.div>

                    <motion.div
                        className="solution-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.2 }}
                    >
                        <div className="icon-circle"><CheckCircle size={24} /></div>
                        <h3>Peace of Mind</h3>
                        <p>No comments. No suggested videos. No rabbit holes.</p>
                    </motion.div>

                    <motion.div
                        className="solution-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.3 }}
                    >
                        <div className="icon-circle"><Heart size={24} /></div>
                        <h3>Favorites System</h3>
                        <p>Kids can "Like" videos to save them to their personal library.</p>
                    </motion.div>

                    <motion.div
                        className="solution-card"
                        initial={{ y: 20, opacity: 0 }}
                        whileInView={{ y: 0, opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.4 }}
                    >
                        <div className="icon-circle"><BarChart size={24} /></div>
                        <h3>Usage Insights</h3>
                        <p>See exactly what your child is watching and enjoying the most.</p>
                    </motion.div>
                </div>
            </div>
        </section>
    );
}
