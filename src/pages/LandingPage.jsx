import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import { Bar, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { jsx } from "react/jsx-runtime";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

const API = "https://clear-am-back-end.vercel.app/api";

const ASSETS = {
  logo: "assets/logo.png",
  jciSidiMansour: "assets/JCI Sidi Mansour.png",
  jciSfax: "assets/JCI Sfax.png",
  jciEnugu: "assets/JCI Enugu.png",
  jciAbujaPrestige: "assets/JCI Abuja Prestige.png",
};

const styles = {
  container: {
    minHeight: "100vh",
    background: "radial-gradient(ellipse at 50% 0%, #0c1a24 0%, #030712 70%)",
    color: "#e2e8f0",
    fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
    overflow: "hidden",
  },
  overlay: {
    position: "fixed",
    inset: 0,
    pointerEvents: "none",
    background:
      "radial-gradient(circle at 20% 50%, rgba(16,185,129,0.03) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(16,185,129,0.02) 0%, transparent 50%)",
    zIndex: 0,
  },
  nav: {
    position: "relative",
    zIndex: 10,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "16px 40px",
    borderBottom: "1px solid rgba(16,185,129,0.1)",
    background: "rgba(3,7,18,0.8)",
    backdropFilter: "blur(12px)",
  },
  navLogo: { display: "flex", alignItems: "center", gap: 12 },
  navLogoImg: { height: 36, width: "auto" },
  navTitle: { fontSize: 20, fontWeight: 700, color: "#10b981", letterSpacing: "-0.5px" },
  navBadge: {
    fontSize: 11,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.15)",
    color: "#6ee7b7",
    border: "1px solid rgba(16,185,129,0.2)",
  },
  hero: {
    position: "relative",
    zIndex: 10,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "60px 24px",
    textAlign: "center",
  },
  jciRow: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    flexWrap: "wrap",
    marginBottom: 48,
  },
  jciLogoWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 4,
  },
  jciLogo: { height: 48, width: "auto", opacity: 0.85, transition: "opacity 0.3s" },
  jciLabel: { fontSize: 10, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" },
  badge: {
    display: "inline-flex",
    alignItems: "center",
    gap: 8,
    padding: "8px 20px",
    borderRadius: 999,
    background: "rgba(16,185,129,0.1)",
    border: "1px solid rgba(16,185,129,0.2)",
    color: "#6ee7b7",
    fontSize: 13,
    fontWeight: 600,
    marginBottom: 24,
  },
  heading: {
    fontSize: "clamp(36px, 6vw, 68px)",
    fontWeight: 800,
    lineHeight: 1.1,
    background: "linear-gradient(135deg, #e2e8f0 0%, #10b981 50%, #6ee7b7 100%)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: "clamp(16px, 2vw, 20px)",
    color: "#94a3b8",
    maxWidth: 720,
    margin: "0 auto 48px",
    lineHeight: 1.6,
  },
  ctaButton: {
    display: "inline-flex",
    alignItems: "center",
    gap: 12,
    padding: "16px 40px",
    borderRadius: 12,
    background: "linear-gradient(135deg, #059669 0%, #10b981 100%)",
    color: "#fff",
    fontSize: 17,
    fontWeight: 700,
    border: "none",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: "0 0 30px rgba(16,185,129,0.3)",
  },
  statsRow: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: 20,
    maxWidth: 1000,
    margin: "60px auto 0",
  },
  statCard: {
    padding: "28px 20px",
    borderRadius: 16,
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
    textAlign: "center",
  },
  statValue: {
    fontSize: "clamp(28px, 4vw, 42px)",
    fontWeight: 800,
    color: "#10b981",
    fontFamily: '"JetBrains Mono", "Fira Code", monospace',
    marginBottom: 4,
  },
  statLabel: { fontSize: 13, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" },
  section: {
    position: "relative",
    zIndex: 10,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "40px 24px 80px",
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 700,
    color: "#f1f5f9",
    marginBottom: 12,
    textAlign: "center",
  },
  sectionSub: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    maxWidth: 600,
    margin: "0 auto 40px",
  },
  chartGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
    gap: 24,
    marginBottom: 40,
  },
  chartCard: {
    padding: 24,
    borderRadius: 16,
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(16,185,129,0.15)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
  },
  chartCardTitle: {
    fontSize: 16,
    fontWeight: 600,
    color: "#f1f5f9",
    marginBottom: 16,
    textAlign: "center",
  },
  chartContainer: { position: "relative", height: 280 },
  partnerGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: 20,
  },
  partnerCard: {
    display: "grid",
    alignItems: "center",
    justifyContent: "center",
    padding: "32px 20px",
    borderRadius: 16,
    background: "rgba(17,24,39,0.7)",
    border: "1px solid rgba(16,185,129,0.12)",
    backdropFilter: "blur(12px)",
    textAlign: "center",
    transition: "all 0.3s",
  },
  partnerLogo: { height: 65, width: "auto", marginBottom: 12, opacity: 0.9, justifyContent: "centre", alignItems: "centre" },
  partnerName: { fontSize: 14, fontWeight: 600, color: "#e2e8f0", marginBottom: 4 },
  partnerCountry: { fontSize: 12, color: "#6b7280" },
  footer: {
    position: "relative",
    zIndex: 10,
    textAlign: "center",
    padding: "32px 24px",
    borderTop: "1px solid rgba(16,185,129,0.1)",
    fontSize: 13,
    color: "#4b5563",
  },
};

const barOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: "rgba(17,24,39,0.95)",
      titleColor: "#f1f5f9",
      bodyColor: "#10b981",
      borderColor: "rgba(16,185,129,0.3)",
      borderWidth: 1,
    },
  },
  scales: {
    x: {
      ticks: { color: "#6b7280" },
      grid: { color: "rgba(255,255,255,0.03)" },
    },
    y: {
      ticks: { color: "#6b7280" },
      grid: { color: "rgba(255,255,255,0.05)" },
      beginAtZero: true,
    },
  },
};

const doughnutOptions = {
  responsive: true,
  maintainAspectRatio: false,
  cutout: "70%",
  plugins: {
    legend: {
      position: "bottom",
      labels: { color: "#94a3b8", padding: 16, usePointStyle: true },
    },
    tooltip: {
      backgroundColor: "rgba(17,24,39,0.95)",
      titleColor: "#f1f5f9",
      bodyColor: "#10b981",
      borderColor: "rgba(16,185,129,0.3)",
      borderWidth: 1,
    },
  },
};

const PARTNERS = [
  { logo: ASSETS.jciSidiMansour, name: "JCI Sidi Mansour", country: "Tunisia" },
  { logo: ASSETS.jciSfax, name: "JCI Sfax", country: "Tunisia" },
  { logo: ASSETS.jciEnugu, name: "JCI Enugu", country: "Nigeria" },
  { logo: ASSETS.jciAbujaPrestige, name: "JCI Abuja Prestige", country: "Nigeria" },
];



export default function LandingPage() {
  const [stats, setStats] = useState(null);
  const [distribution, setDistribution] = useState([]);
  const [ecological, setEcological] = useState(null);

  function AnimatedCounter({ value, suffix = "", decimals = 1 }) {
    const [display, setDisplay] = useState(0);
    const ref = useRef(null);
    const started = useRef(false);

    useEffect(() => {
      if (started.current) return;
      const el = ref.current;
      if (!el) return;
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !started.current) {
            started.current = true;
            const duration = 2000;
            const steps = 60;
            const increment = value / steps;
            let current = 0;
            const timer = setInterval(() => {
              current += increment;
              if (current >= value) {
                setDisplay(value);
                clearInterval(timer);
              } else {
                setDisplay(current);
              }
            }, duration / steps);
          }
        },
        { threshold: 0.3 }
      );
      observer.observe(el);
      return () => observer.disconnect();
    }, [value]);

    return (
      <span ref={ref}>
        {display.toFixed(decimals)}
        {suffix}
      </span>
    );
  }

  const fetchStats = useCallback(async () => {
    try {
      const [globalRes, distRes, ecoRes] = await Promise.all([
        axios.get(`${API}/stats/global`),
        axios.get(`${API}/stats/distribution`),
        axios.get(`${API}/stats/ecological`),
      ]);
      setStats(globalRes.data);
      setDistribution(distRes.data);
      setEcological(ecoRes.data);
    } catch {
      setStats({ totalScanned: 0, totalCleaned: 0, totalCo2: 0, totalUsers: 0 });
    }
  }, []);

  useEffect(() => {
    fetchStats();
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, [fetchStats]);

  const handleConnect = () => {
    window.location.href = `${API.replace("/api", "")}/api/auth/url`;
  };

  const statItems = [
    { value: stats?.totalScanned || 0, label: "GB Scanned", suffix: " GB", decimals: 1 },
    { value: stats?.totalCleaned || 0, label: "GB Cleaned", suffix: " GB", decimals: 1 },
    { value: stats?.totalCo2 || 0, label: "CO\u2082 Saved", suffix: " kg", decimals: 1 },
    { value: stats?.totalUsers || 0, label: "Unique Users", suffix: "", decimals: 0 },
  ];

  const barData = {
    labels: distribution.map((d) => d.label),
    datasets: [
      {
        label: "Users",
        data: distribution.map((d) => d.count),
        backgroundColor: "rgba(16,185,129,0.6)",
        borderColor: "rgba(16,185,129,0.9)",
        borderWidth: 1,
        borderRadius: 6,
      },
    ],
  };

  const cleanedGb = ecological?.cleanedGb || 0;
  const remainingGb = ecological?.estimatedRemainingWasteGb || 1000;
  const doughnutData = {
    labels: ["Cleaned Storage", "Remaining Waste"],
    datasets: [
      {
        data: [cleanedGb, remainingGb - cleanedGb],
        backgroundColor: ["rgba(16,185,129,0.8)", "rgba(107,114,128,0.2)"],
        borderColor: ["rgba(16,185,129,0.6)", "rgba(107,114,128,0.1)"],
        borderWidth: 2,
        hoverOffset: 8,
      },
    ],
  };

  return (
    <div style={styles.container}>
      <div style={styles.overlay} />

      <nav style={styles.nav}>
        <div style={styles.navLogo}>
          <span style={styles.navTitle}>Clear AM!</span>
        </div>
        <span style={styles.navBadge}>Digital Sustainability</span>
      </nav>

      <section style={styles.hero}>
        <div style={styles.badge}>Digital Sustainability Initiative</div>
        <h1 style={styles.heading}>Scan. Clean. Reduce<br />Your Digital Footprint</h1>
        <p style={styles.subtitle}>
          Clear AM empowers you to audit your Google Drive, remove duplicate and
          obsolete files, and shrink your personal carbon footprint — one gigabyte
          at a time.
        </p>

        <button style={styles.ctaButton} onClick={handleConnect}>
          Connect Google Drive
        </button>

        <div style={styles.statsRow}>
          {statItems.map((item) => (
            <div key={item.label} style={styles.statCard}>
              <div style={styles.statValue}>
                <AnimatedCounter value={item.value} suffix={item.suffix} decimals={item.decimals} />
              </div>
              <div style={styles.statLabel}>{item.label}</div>
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Global Environmental Impact</h2>
        <p style={styles.sectionSub}>
          Real-time aggregated statistics across all Clear AM users
        </p>
        <div style={styles.chartGrid}>
          <div style={styles.chartCard}>
            <div style={styles.chartCardTitle}>User Distribution by Cleaning</div>
            <div style={styles.chartContainer}>
              {distribution.length > 0 ? (
                <Bar data={barData} options={barOptions} />
              ) : (
                <div style={{ textAlign: "center", padding: 48, color: "#6b7280" }}>
                  Loading distribution data...
                </div>
              )}
            </div>
          </div>
          <div style={styles.chartCard}>
            <div style={styles.chartCardTitle}>Ecological Impact Overview</div>
            <div style={styles.chartContainer}>
              {ecological ? (
                <Doughnut data={doughnutData} options={doughnutOptions} />
              ) : (
                <div style={{ textAlign: "center", padding: 48, color: "#6b7280" }}>
                  Loading ecological data...
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <section style={styles.section}>
        <h2 style={styles.sectionTitle}>Our Coalition</h2>
        <p style={styles.sectionSub}>
          Four JCI organizations united for a sustainable digital future
        </p>
        <div style={styles.partnerGrid}>
          {PARTNERS.map((p) => (
            <div key={p.name} style={styles.partnerCard}>
              <img src={p.logo} alt={p.name} style={styles.partnerLogo} />
              <div style={styles.partnerName}>{p.name}</div>
              <div style={styles.partnerCountry}>{p.country}</div>
            </div>
          ))}
        </div>
      </section>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} Clear AM!
      </footer>
    </div>
  );
}
