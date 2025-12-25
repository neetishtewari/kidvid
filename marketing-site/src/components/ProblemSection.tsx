import { motion } from 'framer-motion';
import { AlertTriangle, Brain, Clock } from 'lucide-react';
import './Section.css';

export default function ProblemSection() {
    const cards = [
        { icon: <Clock size={32} />, title: "Hours Lost", desc: "Average child spends 4+ hours on screens daily." },
        { icon: <Brain size={32} />, title: "Brain Drain", desc: "Short-form algo-feeds reduce attention span." },
        { icon: <AlertTriangle size={32} />, title: "Unsafe Content", desc: "One click away from inappropriate videos." }
    ];

    return (
        <section className="section-container problem-bg">
            <div className="section-content">
                <motion.h2
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    className="section-title"
                >
                    The <span className="text-danger">Dopamine Trap</span>
                </motion.h2>
                <p className="section-subtitle">
                    Existing platforms are built to addict, not to educate.
                    The algorithm wants your child’s time. You want their growth.
                </p>

                <div className="cards-grid">
                    {cards.map((card, index) => (
                        <motion.div
                            key={index}
                            className="feature-card"
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: index * 0.2 }}
                        >
                            <div className="icon-box danger">{card.icon}</div>
                            <h3>{card.title}</h3>
                            <p>{card.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
