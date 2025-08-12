import React, { useEffect, useState } from "react";
import "./Home.css";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  // counts state declared before usage
  const [counts, setCounts] = useState([0, 0, 0, 0]);

  // Optimized counter animation using a single interval
  useEffect(() => {
    const targets = [6000000, 2500, 1000000, 16];
    const steps = targets.map(target => Math.ceil(target / 50));
    let starts = [0, 0, 0, 0];
    const interval = setInterval(() => {
      let done = true;
      starts = starts.map((start, i) => {
        if (start < targets[i]) {
          done = false;
          return Math.min(start + steps[i], targets[i]);
        }
        return start;
      });
      setCounts(starts);
      if (done) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
  }, []);

  // Motion variants
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  return (
    <div className="container">
      {/* Hero */}
      <motion.div
        className="hero"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <div className="hero-left">
          <h1>
            Smart Parking, <span className="highlight">Simplified.</span>
          </h1>
          <p>
            Real-time slot availability, FASTag payments & seamless access — all in one app.
          </p>
          <div className="button-group">
            <button className="secondary-btn">Learn More</button>
          </div>
        </div>
        <div className="hero-right">
          <video autoPlay muted loop playsInline className="hero-video">
            <source
              src="https://strapi-file-uploads.parkplus.io/Valer_website_1_a7949e5c1a.mp4"
              type="video/mp4"
            />
          </video>
        </div>
      </motion.div>

      {/* Features */}
      <motion.div
        className="features"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        {[
          { icon: "🚗", title: "Fast Entry", desc: "Instant vehicle recognition for quick parking." },
          { icon: "📍", title: "Live Tracking", desc: "Monitor parking slot availability in real-time." },
          { icon: "💳", title: "Auto Billing", desc: "FASTag & UPI payments for hassle-free billing." },
        ].map((item, idx) => (
          <motion.div key={idx} className="feature-card" whileHover={{ scale: 1.05 }}>
            <div className="icon">{item.icon}</div>
            <h3>{item.title}</h3>
            <p>{item.desc}</p>
          </motion.div>
        ))}
      </motion.div>

      {/* Panels */}
      <motion.div
        className="panels"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        {[
          {
            title: "User Panel",
            desc: "Book slots, track history, manage vehicles.",
            color: "rgba(255, 249, 219, 0.4)",
            onClick: () => navigate("/login")
          },
          {
            title: "Admin Panel",
            desc: "Analytics, slot management, pricing control.",
            color: "rgba(230, 240, 255, 0.4)",
            onClick: () => navigate("/admin")
          },
        ].map((panel, idx) => (
          <motion.div
            key={idx}
            className="panel"
            style={{ backgroundColor: panel.color }}
            whileHover={{ scale: 1.03 }}
          >
            <h2>{panel.title}</h2>
            <p>{panel.desc}</p>
            <button onClick={panel.onClick}>Enter {panel.title}</button>
          </motion.div>
        ))}
      </motion.div>

      {/* Stats */}
      <motion.div
        className="stats"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
      >
        <h3>Trusted Across India</h3>
        <div className="stats-grid">
          <div className="stat">{counts[0].toLocaleString()}+ Downloads</div>
          <div className="stat">{counts[1].toLocaleString()}+ Sites</div>
          <div className="stat">{counts[2].toLocaleString()}+ FASTag Issued</div>
          <div className="stat">{counts[3]} Cities Live</div>
        </div>
      </motion.div>

      {/* Footer */}
      <footer>
        <p>📍 Tech City, IN 400001 | 📞 +91 98765 43210 | ✉️ contact@smartparking.io</p>
        <p>© 2025 Smart Parking. All rights reserved.</p>
      </footer>
    </div>
  );
}
